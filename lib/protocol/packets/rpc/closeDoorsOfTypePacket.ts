import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType, SystemType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `1b` (`27`)
 */
export class CloseDoorsOfTypePacket extends BaseRpcPacket {
  constructor(
    public system: SystemType,
  ) {
    super(RpcPacketType.CloseDoorsOfType);
  }

  static deserialize(reader: MessageReader): CloseDoorsOfTypePacket {
    return new CloseDoorsOfTypePacket(reader.readByte());
  }

  clone(): CloseDoorsOfTypePacket {
    return new CloseDoorsOfTypePacket(this.system);
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.system);
  }
}
