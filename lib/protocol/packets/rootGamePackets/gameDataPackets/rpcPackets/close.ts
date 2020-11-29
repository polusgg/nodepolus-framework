import { MessageWriter, MessageReader } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class ClosePacket extends BaseRPCPacket {
  constructor() {
    super(RPCPacketType.Close);
  }

  static deserialize(reader: MessageReader): ClosePacket {
    return new ClosePacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
