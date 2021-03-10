import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType } from "../../../types/enums";
import { BaseHazelPacket } from ".";

/**
 * Hazel Packet ID: `0x0c` (`12`)
 */
export class PingPacket extends BaseHazelPacket {
  constructor() {
    super(HazelPacketType.Ping);
  }

  static deserialize(_reader: MessageReader): PingPacket {
    return new PingPacket();
  }

  clone(): PingPacket {
    return new PingPacket();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serialize(_writer: MessageWriter): void {}
}
