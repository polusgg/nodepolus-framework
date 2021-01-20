import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

/**
 * RPC Packet ID: `0x14` (`20`)
 */
export class ExitVentPacket extends BaseRPCPacket {
  constructor(
    public readonly ventId: number,
  ) {
    super(RPCPacketType.ExitVent);
  }

  static deserialize(reader: MessageReader): ExitVentPacket {
    return new ExitVentPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.ventId);
  }
}
