import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class EnterVentPacket extends BaseRPCPacket {
  constructor(readonly ventId: number) {
    super(RPCPacketType.EnterVent);
  }

  static deserialize(reader: MessageReader): EnterVentPacket {
    return new EnterVentPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.ventId);
  }
}
