import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { VoteStateMask } from "../../../../types/enums";

export class VoteState {
  constructor(
    protected reported: boolean,
    protected voted: boolean,
    protected dead: boolean,
    protected votedFor: number,
  ) {}

  static deserialize(reader: MessageReader): VoteState {
    const state = reader.readByte();

    return new VoteState(
      (state & VoteStateMask.DidReport) == VoteStateMask.DidReport,
      (state & VoteStateMask.DidVote) == VoteStateMask.DidVote,
      (state & VoteStateMask.IsDead) == VoteStateMask.IsDead,
      (state & VoteStateMask.DidVote) == VoteStateMask.DidVote ? (state & VoteStateMask.VotedFor) - 1 : 14,
    );
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(
      (this.reported ? VoteStateMask.DidReport : 0) |
      (this.voted ? VoteStateMask.DidVote : 0) |
      (this.dead ? VoteStateMask.IsDead : 0) |
      (this.voted ? ((this.votedFor + 1) & VoteStateMask.VotedFor) : 15),
    );
  }

  didReport(): boolean {
    return this.reported;
  }

  setReported(reported: boolean): this {
    this.reported = reported;

    return this;
  }

  didVote(): boolean {
    return this.voted;
  }

  setVoted(voted: boolean): this {
    this.voted = voted;

    return this;
  }

  isDead(): boolean {
    return this.dead;
  }

  setDead(dead: boolean): this {
    this.dead = dead;

    return this;
  }

  getVotedFor(): number {
    return this.votedFor;
  }

  setVotedFor(votedFor: number): this {
    this.votedFor = votedFor;

    return this;
  }

  /**
   * Gets a clone of the VoteState instance.
   */
  clone(): VoteState {
    return new VoteState(this.reported, this.voted, this.dead, this.votedFor);
  }
}
