import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BasePacket } from "../basePacket";
import { PacketType } from "../types";

export class PingPacket extends BasePacket {
  constructor(public nonce: number) {
    super(PacketType.Ping);
  }

  static deserialize(reader: MessageReader): PingPacket {
    return new PingPacket(reader.readUInt16(true));
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();

    writer.writeUInt16(this.nonce);

    return writer;
  }
}
