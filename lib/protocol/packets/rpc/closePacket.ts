import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

export class ClosePacket extends BaseRPCPacket {
  constructor() {
    super(RPCPacketType.Close);
  }

  static deserialize(_reader: MessageReader): ClosePacket {
    return new ClosePacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
