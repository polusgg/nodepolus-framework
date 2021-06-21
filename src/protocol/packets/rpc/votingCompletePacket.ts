import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { VoteState } from "../../../types";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x17` (`23`)
 */
export class VotingCompletePacket extends BaseRpcPacket {
  constructor(
    public states: Map<number, VoteState>,
    public exiledPlayerId: number,
    public isTie: boolean,
  ) {
    super(RpcPacketType.VotingComplete);
  }

  static deserialize(reader: MessageReader): VotingCompletePacket {
    return new VotingCompletePacket(
      new Map(reader.readMessageList(sub => [sub.getTag(), VoteState.deserialize(sub, false)])),
      reader.readByte(),
      reader.readBoolean(),
    );
  }

  clone(): VotingCompletePacket {
    return new VotingCompletePacket(new Map([...this.states.entries()].map(entry => [entry[0], entry[1].clone()])), this.exiledPlayerId, this.isTie);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.states.size);

    for (const [id, state] of this.states.entries()) {
      writer.startMessage(id);
      writer.writeObject(state, { isComplete: true });
      writer.endMessage();
    }

    writer
      .writeByte(this.didVotePlayerOff() ? this.exiledPlayerId : 0xff)
      .writeBoolean(this.isTie);
  }

  didVotePlayerOff(): boolean {
    return this.exiledPlayerId != 0xff;
  }
}
