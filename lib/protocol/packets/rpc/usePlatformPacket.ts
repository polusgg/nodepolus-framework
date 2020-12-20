import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

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
