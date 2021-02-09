import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { VoteState } from "../../entities/meetingHud/types";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x17` (`23`)
 */
export class VotingCompletePacket extends BaseRpcPacket {
  public readonly didVotePlayerOff: boolean;

  constructor(
    public readonly states: VoteState[],
    public readonly exiledPlayerId: number,
    public readonly isTie: boolean,
  ) {
    super(RpcPacketType.VotingComplete);

    this.didVotePlayerOff = this.exiledPlayerId != 0xff;
  }

  static deserialize(reader: MessageReader): VotingCompletePacket {
    return new VotingCompletePacket(
      reader.readList(sub => VoteState.deserialize(sub)),
      reader.readByte(),
      reader.readBoolean(),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeList(this.states, (sub, state) => state.serialize(sub))
      .writeByte(this.didVotePlayerOff ? this.exiledPlayerId : 0xff)
      .writeBoolean(this.isTie);
  }
}
