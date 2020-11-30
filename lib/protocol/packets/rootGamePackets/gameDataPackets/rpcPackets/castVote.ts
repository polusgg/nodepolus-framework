import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class CastVotePacket extends BaseRPCPacket {
  public readonly didSkip: boolean;

  public readonly didNotVote: boolean;

  constructor(readonly votingPlayerId: number, readonly suspectPlayerId: number) {
    super(RPCPacketType.CastVote);

    this.didSkip = this.suspectPlayerId == 0xff;
    this.didNotVote = this.suspectPlayerId == -1;
  }

  static deserialize(reader: MessageReader): CastVotePacket {
    return new CastVotePacket(reader.readByte(), reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.votingPlayerId)
      .writeByte(this.suspectPlayerId);
  }
}
