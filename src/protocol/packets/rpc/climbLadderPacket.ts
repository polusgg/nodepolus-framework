import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x1f` (`31`)
 */
export class ClimbLadderPacket extends BaseRpcPacket {
  constructor(
    public ladderId: number,
    public ladderSequenceId: number,
  ) {
    super(RpcPacketType.ClimbLadder);
  }

  static deserialize(reader: MessageReader): ClimbLadderPacket {
    return new ClimbLadderPacket(reader.readByte(), reader.readByte());
  }

  clone(): ClimbLadderPacket {
    return new ClimbLadderPacket(this.ladderId, this.ladderSequenceId);
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.ladderId);
    writer.writeByte(this.ladderSequenceId);
  }
}
