import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { GameOptionsData } from "../../../types/gameOptionsData";
import { BaseRootGamePacket } from "../basePacket";
import { RoomCode } from "../../../util/roomCode";
import { RootGamePacketType } from "../types";
import { Level } from "../../../types/level";

export class RoomListing {
  constructor(
    readonly ipAddress: string,
    readonly port: number,
    readonly roomCode: string,
    readonly hostName: string,
    readonly playerCount: number,
    readonly age: number,
    readonly level: Level,
    readonly impostorCount: number,
    readonly maxPlayers: number,
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

export class GetGameListRequestPacket extends BaseRootGamePacket {
  constructor(
    readonly includePrivate: boolean,
    readonly options: GameOptionsData,
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
    readonly rooms: RoomListing[],
    readonly skeldCount?: number,
    readonly miraCount?: number,
    readonly polusCount?: number,
  ) {
    super(RootGamePacketType.GetGameList);
  }

  static deserialize(reader: MessageReader): GetGameListResponsePacket {
    let skeldCount: number | undefined;
    let miraCount: number | undefined;
    let polusCount: number | undefined;
    const rooms: RoomListing[] = [];

    reader.readAllChildMessages(child => {
      if (child.tag == 1) {
        skeldCount = reader.readUInt32();
        miraCount = reader.readUInt32();
        polusCount = reader.readUInt32();
      } else if (child.tag == 0) {
        child.readAllChildMessages(roomMessage => {
          rooms.push(RoomListing.deserialize(roomMessage));
        });
      }
    });

    return new GetGameListResponsePacket(
      rooms,
      skeldCount,
      miraCount,
      polusCount,
    );
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    if (this.skeldCount && this.miraCount && this.polusCount) {
      writer.startMessage(1)
        .writeUInt32(this.skeldCount)
        .writeUInt32(this.miraCount)
        .writeUInt32(this.polusCount)
        .endMessage();
    }

    writer.startMessage(0);
    this.rooms.forEach(room => room.serialize(writer));

    return writer.endMessage();
  }
}
