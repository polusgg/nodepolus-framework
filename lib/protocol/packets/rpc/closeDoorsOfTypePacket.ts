import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { SystemType } from "../../../types/enums";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

export class CloseDoorsOfTypePacket extends BaseRPCPacket {
  constructor(
    public readonly system: SystemType,
  ) {
    super(RPCPacketType.CloseDoorsOfType);
  }

  static deserialize(reader: MessageReader): CloseDoorsOfTypePacket {
    return new CloseDoorsOfTypePacket(reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.system);
  }
}
