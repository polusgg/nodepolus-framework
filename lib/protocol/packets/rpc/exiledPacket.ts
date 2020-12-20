import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

export class ExiledPacket extends BaseRPCPacket {
  constructor() {
    super(RPCPacketType.Exiled);
  }

  static deserialize(_reader: MessageReader): ExiledPacket {
    return new ExiledPacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
