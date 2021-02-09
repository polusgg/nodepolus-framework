import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x18` (`24`)
 */
export class CastVotePacket extends BaseRpcPacket {
  public readonly didSkip: boolean;

  constructor(
    public readonly votingPlayerId: number,
    public readonly suspectPlayerId: number,
  ) {
    super(RpcPacketType.CastVote);

    this.didSkip = this.suspectPlayerId == 0xff;
  }

  static deserialize(reader: MessageReader): CastVotePacket {
    return new CastVotePacket(reader.readByte(), reader.readSByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.votingPlayerId)
      .writeSByte(this.suspectPlayerId);
  }
}
