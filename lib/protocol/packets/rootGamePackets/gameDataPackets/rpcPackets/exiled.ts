import { MessageWriter, MessageReader } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class ExiledPacket extends BaseRPCPacket {
  constructor() {
    super(RPCPacketType.Exiled);
  }

  static deserialize(reader: MessageReader): ExiledPacket {
    return new ExiledPacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
