import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x13` (`19`)
 */
export class EnterVentPacket extends BaseRpcPacket {
  constructor(
    public ventId: number,
  ) {
    super(RpcPacketType.EnterVent);
  }

  static deserialize(reader: MessageReader): EnterVentPacket {
    return new EnterVentPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.ventId);
  }
}
