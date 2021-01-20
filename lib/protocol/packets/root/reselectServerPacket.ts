import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

export class MasterServer {
  constructor(
    public readonly name: string,
    public readonly ipAddress: string,
    public readonly port: number,
    public readonly playerCount: number,
  ) {}

  static deserialize(reader: MessageReader): MasterServer {
    return new MasterServer(
      reader.readString(),
      reader.readBytes(4).getBuffer().join("."),
      reader.readUInt16(),
      reader.readPackedUInt32(),
    );
  }

  serialize(writer: MessageWriter): void {
    writer
      .writeString(this.name)
      .writeBytes(this.ipAddress.split(".").map(octet => parseInt(octet, 10)))
      .writeUInt16(this.port)
      .writePackedUInt32(this.playerCount);
  }
}

/**
 * Root Packet ID: `0x0e` (`14`)
 */
export class ReselectServerPacket extends BaseRootPacket {
  constructor(
    public readonly unknown: number,
    public readonly servers: MasterServer[],
  ) {
    super(RootPacketType.ReselectServer);
  }

  static deserialize(reader: MessageReader): ReselectServerPacket {
    return new ReselectServerPacket(
      reader.readByte(),
      reader.readMessageList(sub => MasterServer.deserialize(sub)),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.unknown)
      .writeMessageList(this.servers, (subWriter, item) => {
        item.serialize(subWriter);
      });
  }
}
