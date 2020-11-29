import { MessageWriter, MessageReader } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";
import { VoteState } from "../../../../entities/meetingHud/innerMeetingHud";

export class VotingCompletePacket extends BaseRPCPacket {
  public readonly didVotePlayerOff: boolean;

  constructor(
    public readonly states: VoteState[],
    public readonly isTie: boolean,
    public readonly exiledPlayerId?: number,
  ) {
    super(RPCPacketType.VotingComplete);

    this.didVotePlayerOff = !this.isTie && this.exiledPlayerId != 0xff;
  }

  static deserialize(reader: MessageReader): VotingCompletePacket {
    return new VotingCompletePacket(
      reader.readList(sub => VoteState.deserialize(sub)),
      reader.readBoolean(),
      reader.readByte(),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeList(this.states, (sub, state) => state.serialize(sub))
      .writeBoolean(this.isTie)
      .writeByte(this.exiledPlayerId ?? 0xff);
  }
}
