import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRPCPacket } from "../basePacket";
import { RPCPacketType } from "../types";

export class CastVotePacket extends BaseRPCPacket {
  public readonly didSkip: boolean;

  constructor(
    public readonly votingPlayerId: number,
    public readonly suspectPlayerId: number,
  ) {
    super(RPCPacketType.CastVote);

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
