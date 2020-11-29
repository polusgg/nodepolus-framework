import { MessageWriter, MessageReader } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class ReportDeadBodyPacket extends BaseRPCPacket {
  constructor(public readonly victimPlayerId?: number) {
    super(RPCPacketType.ReportDeadBody);
  }

  static deserialize(reader: MessageReader): ReportDeadBodyPacket {
    let victimPlayerId = reader.readByte();

    return new ReportDeadBodyPacket(victimPlayerId == 0xff ? undefined : victimPlayerId);
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.victimPlayerId ?? 0xff);
  }
}
