import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BasePacket } from "../basePacket";
import { PacketType } from "../types";

export class PingPacket extends BasePacket {
  constructor() {
    super(PacketType.Ping);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static deserialize(_reader: MessageReader): PingPacket {
    return new PingPacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
