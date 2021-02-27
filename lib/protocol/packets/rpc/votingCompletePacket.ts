import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { VoteState } from "../../../types";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x17` (`23`)
 */
export class VotingCompletePacket extends BaseRpcPacket {
  constructor(
    public states: VoteState[],
    public exiledPlayerId: number,
    public isTie: boolean,
  ) {
    super(RpcPacketType.VotingComplete);
  }

  static deserialize(reader: MessageReader): VotingCompletePacket {
    return new VotingCompletePacket(
      reader.readList(sub => VoteState.deserialize(sub)),
      reader.readByte(),
      reader.readBoolean(),
    );
  }

  clone(): VotingCompletePacket {
    const states = new Array(this.states.length);

    for (let i = 0; i < states.length; i++) {
      states[i] = this.states[i].clone();
    }

    return new VotingCompletePacket(states, this.exiledPlayerId, this.isTie);
  }

  serialize(writer: MessageWriter): void {
    writer.writeList(this.states, (sub, state) => sub.writeObject(state))
      .writeByte(this.didVotePlayerOff() ? this.exiledPlayerId : 0xff)
      .writeBoolean(this.isTie);
  }

  didVotePlayerOff(): boolean {
    return this.exiledPlayerId != 0xff;
  }
}
