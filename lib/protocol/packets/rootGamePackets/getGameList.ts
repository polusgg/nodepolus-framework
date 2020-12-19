import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOptionsData } from "../../../types/gameOptionsData";
import { BaseRootGamePacket } from "../basePacket";
import { RoomCode } from "../../../util/roomCode";
import { RootGamePacketType } from "../types";
import { Level } from "../../../types/level";

export class RoomListing {
  constructor(
    public readonly ipAddress: string,
    public readonly port: number,
    public readonly roomCode: string,
    public readonly hostName: string,
    public readonly playerCount: number,
    public readonly age: number,
    public readonly level: Level,
    public readonly impostorCount: number,
    public readonly maxPlayers: number,
  ) {}

  static deserialize(reader: MessageReader): RoomListing {
    return new RoomListing(
      reader.readBytes(4).buffer.join("."),
      reader.readUInt16(),
      RoomCode.decode(reader.readInt32()),
      reader.readString(),
      reader.readByte(),
      reader.readPackedUInt32(),
      reader.readByte(),
      reader.readByte(),
      reader.readByte(),
    );
  }

  serialize(writer: MessageWriter): void {
    writer.writeBytes(this.ipAddress.split(".").map(octet => parseInt(octet, 10)))
      .writeUInt16(this.port)
      .writeInt32(RoomCode.encode(this.roomCode))
      .writeString(this.hostName)
      .writeByte(this.playerCount)
      .writePackedUInt32(this.age)
      .writeByte(this.level)
      .writeByte(this.impostorCount)
      .writeByte(this.maxPlayers);
  }
}

export class GameListCounts {
  constructor(
    public skeld: number = 0,
    public mira: number = 0,
    public polus: number = 0,
    public airship: number = 0,
  ) {}

  increment(level: Level): void {
    this.add(level, 1);
  }

  decrement(level: Level): void {
    this.add(level, -1);
  }

  add(level: Level, amount: number): void {
    switch (level) {
      case Level.TheSkeld:
      case Level.AprilSkeld:
        this.skeld += amount;
        break;
      case Level.MiraHq:
        this.mira += amount;
        break;
      case Level.Polus:
        this.polus += amount;
        break;
      case Level.Airship:
        this.airship += amount;
        break;
    }
  }
}

export class GetGameListRequestPacket extends BaseRootGamePacket {
  constructor(
    public readonly includePrivate: boolean,
    public readonly options: GameOptionsData,
  ) {
    super(RootGamePacketType.GetGameList);
  }

  static deserialize(reader: MessageReader): GetGameListRequestPacket {
    return new GetGameListRequestPacket(
      reader.readBoolean(),
      GameOptionsData.deserialize(reader, true),
    );
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter().writeBoolean(this.includePrivate);

    this.options.serialize(writer, true);

    return writer;
  }
}

export class GetGameListResponsePacket extends BaseRootGamePacket {
  constructor(
    public readonly rooms: RoomListing[],
    public readonly counts?: GameListCounts,
  ) {
    super(RootGamePacketType.GetGameList);
  }

  static deserialize(reader: MessageReader): GetGameListResponsePacket {
    let counts: GameListCounts | undefined;
    const rooms: RoomListing[] = [];

    reader.readAllChildMessages(child => {
      if (child.tag == 1) {
        counts = new GameListCounts(
          reader.readUInt32(),
          reader.readUInt32(),
          reader.readUInt32(),
          reader.readUInt32(),
        );
      } else if (child.tag == 0) {
        child.readAllChildMessages(roomMessage => {
          rooms.push(RoomListing.deserialize(roomMessage));
        });
      }
    });

    return new GetGameListResponsePacket(
      rooms,
      counts,
    );
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    if (this.counts) {
      writer.startMessage(1)
        .writeUInt32(this.counts.skeld)
        .writeUInt32(this.counts.mira)
        .writeUInt32(this.counts.polus)
        .endMessage();
    }

    writer.startMessage(0);

    for (let i = 0; i < this.rooms.length; i++) {
      writer.startMessage(0x01);
      this.rooms[i].serialize(writer);
      writer.endMessage();
    }

    return writer.endMessage();
  }
}
