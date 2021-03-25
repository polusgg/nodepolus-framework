import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x18` (`24`)
 */
export class CastVotePacket extends BaseRpcPacket {
  constructor(
    public votingPlayerId: number,
    public suspectPlayerId: number,
  ) {
    super(RpcPacketType.CastVote);
  }

  static deserialize(reader: MessageReader): CastVotePacket {
    return new CastVotePacket(reader.readByte(), reader.readSByte());
  }

  clone(): CastVotePacket {
    return new CastVotePacket(this.votingPlayerId, this.suspectPlayerId);
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.votingPlayerId).writeSByte(this.suspectPlayerId);
  }

  didSkip(): boolean {
    return this.suspectPlayerId == 0xff;
  }
}
