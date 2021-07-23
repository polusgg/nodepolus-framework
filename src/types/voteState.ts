import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { VoteStateConstants } from "./enums";
import { CanSerializeToHazel } from ".";

/**
 * A class used to store and modify a player's vote in a meeting.
 */

export type VoteStateSerialiazationOptions = {
  isComplete: boolean;
};

export class VoteState implements CanSerializeToHazel<VoteStateSerialiazationOptions> {
  /**
   * @param votedFor - The ID of the player that was voted for
   * @param dead - If the player was dead
   * @param disabled - Whether the player's vote area has the disabled overlay
   * @param reported - `true` if the player reported the body or called the meeting, `false` if not
   */
  constructor(
    protected votedFor: number | VoteStateConstants,
    protected dead: boolean,
    protected disabled: boolean,
    protected reported: boolean,
  ) {}

  /**
   * Gets a new VoteState by reading from the given MessageReader.
   *
   * @param reader - The MessageReader to read from
   * @param isComplete - Whether the message is from VotingComplete
   */
  static deserialize(reader: MessageReader, isComplete: boolean = false): VoteState {
    const votedFor = reader.readByte();
    const dead = reader.readBoolean();
    const disabled = reader.readBoolean();
    const reported = isComplete ? false : reader.readBoolean();

    return new VoteState(
      votedFor,
      dead,
      disabled,
      reported,
    );
  }

  /**
   * Writes the VoteState to the given MessageWriter
   *
   * @param writer - The MessageWriter to write to
   * @param options - Whether the message is for VotingComplete
   */
  serialize(writer: MessageWriter, options?: VoteStateSerialiazationOptions): void {
    writer.writeByte(this.votedFor);

    const isData = options === undefined || !options.isComplete;

    if (isData) {
      writer.writeBoolean(this.isDead());
      writer.writeBoolean(this.isDisabled());
      writer.writeBoolean(this.reported);
    }
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
    return this.votedFor !== VoteStateConstants.HasNotVoted &&
      this.votedFor !== VoteStateConstants.MissedVote &&
      this.votedFor !== VoteStateConstants.HasNotVoted;
  }

  /**
   * Gets whether or not the player is dead.
   *
   * @returns `true` if the player is dead, `false` if not
   */
  isDead(): boolean {
    return this.dead;
  }

  setDead(dead: boolean): this {
    this.dead = dead;

    return this;
  }

  /**
   * Gets whether or not the player's vote area is disabled.
   *
   * @returns `true` if the vote area is disabled, `false` if not
   */
  isDisabled(): boolean {
    return this.disabled;
  }

  setDisabled(disabled: boolean): this {
    this.disabled = disabled;

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
  setVotedFor(votedFor: number | VoteStateConstants): this {
    this.votedFor = votedFor;

    return this;
  }

  /**
   * Gets a clone of the VoteState instance.
   */
  clone(): VoteState {
    return new VoteState(this.votedFor, this.dead, this.disabled, this.reported);
  }
}
