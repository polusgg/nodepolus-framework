import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

/**
 * RPC Packet ID: `0x13` (`19`)
 */
export class EnterVentPacket extends BaseRPCPacket {
  constructor(
    public readonly ventId: number,
  ) {
    super(RPCPacketType.EnterVent);
  }

  static deserialize(reader: MessageReader): EnterVentPacket {
    return new EnterVentPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.ventId);
  }
}
