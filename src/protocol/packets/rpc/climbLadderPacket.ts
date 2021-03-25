import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

export enum LadderSize {
  Short = 0x00,
  Long = 0x01,
}

export enum LadderDirection {
  Down = 0x00,
  Up = 0x01,
}

/**
 * RPC Packet ID: `0x1f` (`31`)
 */
export class ClimbLadderPacket extends BaseRpcPacket {
  constructor(
    public ladderSize: LadderSize,
    public ladderDirection: LadderDirection,
  ) {
    super(RpcPacketType.ExitVent);
  }

  static deserialize(reader: MessageReader): ClimbLadderPacket {
    const byte = reader.readByte();

    return new ClimbLadderPacket(byte & 0x02, byte & 0x01);
  }

  clone(): ClimbLadderPacket {
    return new ClimbLadderPacket(this.ladderSize, this.ladderDirection);
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte((this.ladderSize == LadderSize.Short ? 0 : 2) | this.ladderDirection);
  }
}