import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
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
    writer.writeBytes(this.ipAddress.split(".").map((octet) => parseInt(octet)))
      .writeUInt16(this.port)
      .writeInt32(RoomCode.encode(this.roomCode))
      .writeString(this.hostName)
      .writeByte(this.playerCount)
      .writePackedUInt32(this.age)
      .writeByte(this.level)
      .writeByte(this.impostorCount)
      .writeByte(this.maxPlayers);
  }
};

export class GetGameListResponse extends BaseRootGamePacket {
  constructor(
    public readonly rooms: RoomListing[],
    public readonly skeldCount?: number,
    public readonly miraCount?: number,
    public readonly polusCount?: number,
  ) {
    super(RootGamePacketType.GetGameList);
  }

  static deserialize(reader: MessageReader): GetGameListResponse {
    let skeldCount: number | undefined;
    let miraCount: number | undefined;
    let polusCount: number | undefined;
    let rooms: RoomListing[] = [];

    reader.readAllChildMessages((child) => {
      if (child.tag == 1) {
        skeldCount = reader.readUInt32();
        miraCount = reader.readUInt32();
        polusCount = reader.readUInt32();
      } else if (child.tag == 0) {
        child.readAllChildMessages((roomMessage) => {
          rooms.push(RoomListing.deserialize(roomMessage));
        });
      }
    });

    return new GetGameListResponse(
      rooms,
      skeldCount,
      miraCount,
      polusCount,
    );
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();

    if (this.skeldCount && this.miraCount && this.polusCount) {
      writer.startMessage(1)
        .writeUInt32(this.skeldCount)
        .writeUInt32(this.miraCount)
        .writeUInt32(this.polusCount)
        .endMessage();
    }

    writer.startMessage(0);
    this.rooms.forEach((room) => room.serialize(writer));

    return writer.endMessage();
  }
};
