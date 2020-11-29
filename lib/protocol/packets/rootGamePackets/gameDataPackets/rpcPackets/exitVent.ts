import { MessageWriter, MessageReader } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class ExitVentPacket extends BaseRPCPacket {
  constructor(public readonly ventId: number) {
    super(RPCPacketType.ExitVent);
  }

  static deserialize(reader: MessageReader): ExitVentPacket {
    return new ExitVentPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.ventId);
  }
}
