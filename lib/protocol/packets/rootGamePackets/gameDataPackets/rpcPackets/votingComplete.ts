import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { VoteState } from "../../../../entities/meetingHud/innerMeetingHud";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class VotingCompletePacket extends BaseRPCPacket {
  public readonly didVotePlayerOff: boolean;

  constructor(
    readonly states: VoteState[],
    readonly isTie: boolean,
    readonly exiledPlayerId?: number,
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
