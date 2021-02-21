import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../../../types/enums";
import { BaseRootPacket } from "../root";

export class MasterServer {
  constructor(
    public name: string,
    public ipAddress: string,
    public port: number,
    public playerCount: number,
  ) {}

  static deserialize(reader: MessageReader): MasterServer {
    return new MasterServer(
      reader.readString(),
      reader.readBytes(4).getBuffer().join("."),
      reader.readUInt16(),
      reader.readPackedUInt32(),
    );
  }

  clone(): MasterServer {
    return new MasterServer(this.name, this.ipAddress, this.port, this.playerCount);
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
    public unknown: number,
    public servers: MasterServer[],
  ) {
    super(RootPacketType.ReselectServer);
  }

  static deserialize(reader: MessageReader): ReselectServerPacket {
    return new ReselectServerPacket(
      reader.readByte(),
      reader.readMessageList(sub => MasterServer.deserialize(sub)),
    );
  }

  clone(): ReselectServerPacket {
    const servers = new Array(this.servers.length);

    for (let i = 0; i < servers.length; i++) {
      servers[i] = this.servers[i].clone();
    }

    return new ReselectServerPacket(this.unknown, servers);
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.unknown)
      .writeMessageList(this.servers, (subWriter, item) => {
        item.serialize(subWriter);
      });
  }
}
