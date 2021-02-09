import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x0b` (`11`)
 */
export class ReportDeadBodyPacket extends BaseRpcPacket {
  constructor(
    public readonly victimPlayerId?: number,
  ) {
    super(RpcPacketType.ReportDeadBody);
  }

  static deserialize(reader: MessageReader): ReportDeadBodyPacket {
    const victimPlayerId = reader.readByte();

    return new ReportDeadBodyPacket(victimPlayerId == 0xff ? undefined : victimPlayerId);
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.victimPlayerId ?? 0xff);
  }
}
