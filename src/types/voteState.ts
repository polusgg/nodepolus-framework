import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { CanSerializeToHazel } from ".";
import { VoteStateMask } from "./enums";

/**
 * A class used to store and modify a player's vote in a meeting.
 */
export class VoteState implements CanSerializeToHazel {
  /**
   * @param reported - `true` if the player reported the body or called the meeting, `false` if not
   * @param voted - `true` if the player has voted, `false` if not
   * @param dead - `true` if the player is dead, `false` if not
   * @param votedFor - The ID of the player that was voted for
   */
  constructor(
    protected reported: boolean,
    protected voted: boolean,
    protected dead: boolean,
    protected votedFor: number,
  ) {}

  /**
   * Gets a new VoteState by reading from the given MessageReader.
   *
   * @param reader - The MessageReader to read from
   */
  static deserialize(reader: MessageReader): VoteState {
    const state = reader.readByte();

    return new VoteState(
      (state & VoteStateMask.DidReport) == VoteStateMask.DidReport,
      (state & VoteStateMask.DidVote) == VoteStateMask.DidVote,
      (state & VoteStateMask.IsDead) == VoteStateMask.IsDead,
      (state & VoteStateMask.DidVote) == VoteStateMask.DidVote ? (state & VoteStateMask.VotedFor) - 1 : 14,
    );
  }

  /**
   * Writes the VoteState to the given MessageWriter
   *
   * @param writer - The MessageWriter to write to
   */
  serialize(writer: MessageWriter): void {
    writer.writeByte(
      (this.reported ? VoteStateMask.DidReport : 0) |
      (this.voted ? VoteStateMask.DidVote : 0) |
      (this.dead ? VoteStateMask.IsDead : 0) |
      (this.voted ? ((this.votedFor + 1) & VoteStateMask.VotedFor) : 15),
    );
  }

  /**
   * Gets whether or not the player reported the body or called the meeting.
   *
   * @returns `true` if the player reported the body or called the meeting, `false` if not
   */
  didReport(): boolean {
    return this.reported;
  }

  /**
   * Sets whether or not the player reported the body or called the meeting.
   *
   * @param reported - `true` if the player reported the body or called the meeting, `false` if not
   */
  setReported(reported: boolean): this {
    this.reported = reported;

    return this;
  }

  /**
   * Gets whether or not the player has voted.
   *
   * @returns `true` if the player has voted, `false` if not
   */
  didVote(): boolean {
    return this.voted;
  }

  /**
   * Sets whether or not the player has voted.
   *
   * @param voted - `true` if the player has voted, `false` if not
   */
  setVoted(voted: boolean): this {
    this.voted = voted;

    return this;
  }

  /**
   * Gets whether or not the player is dead.
   *
   * @returns `true` if the player is dead, `false` if not
   */
  isDead(): boolean {
    return this.dead;
  }

  /**
   * Sets whether or not the player is dead.
   *
   * @param dead - `true` if the player is dead, `false` if not
   */
  setDead(dead: boolean): this {
    this.dead = dead;

    return this;
  }

  /**
   * Gets the ID of the player that was voted for.
   */
  getVotedFor(): number {
    return this.votedFor;
  }

  /**
   * Sets the ID of the player that was voted for.
   *
   * @param votedFor - The new ID of the player that was voted for
   */
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
