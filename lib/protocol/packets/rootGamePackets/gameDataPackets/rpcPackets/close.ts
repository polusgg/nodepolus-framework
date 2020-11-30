import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class ClosePacket extends BaseRPCPacket {
  constructor() {
    super(RPCPacketType.Close);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static deserialize(_reader: MessageReader): ClosePacket {
    return new ClosePacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
