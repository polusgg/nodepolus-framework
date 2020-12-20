import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType } from "../types/enums";
import { BaseHazelPacket } from ".";

export class PingPacket extends BaseHazelPacket {
  constructor() {
    super(HazelPacketType.Ping);
  }

  static deserialize(_reader: MessageReader): PingPacket {
    return new PingPacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
