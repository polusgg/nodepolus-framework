import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class UsePlatformPacket extends BaseRPCPacket {
  constructor() {
    super(RPCPacketType.UsePlatform);
  }

  static deserialize(_reader: MessageReader): UsePlatformPacket {
    return new UsePlatformPacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
