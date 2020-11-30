import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { SystemType } from "../../../../../types/systemType";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class CloseDoorsOfTypePacket extends BaseRPCPacket {
  constructor(readonly system: SystemType) {
    super(RPCPacketType.CloseDoorsOfType);
  }

  static deserialize(reader: MessageReader): CloseDoorsOfTypePacket {
    return new CloseDoorsOfTypePacket(reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.system);
  }
}
