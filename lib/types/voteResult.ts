import { PlayerInstance } from "../api/player";

/**
 * A class used to store and modify a player's vote in a meeting.
 */
export class VoteResult {
  /**
   * @param player - The player that the VoteResult belongs to
   * @param votedFor - The player that was voted for
   * @param skipped - `true` if the vote was to skip, `false` if not
   */
  constructor(
    private readonly player: PlayerInstance,
    private votedFor?: PlayerInstance,
    private skipped: boolean = false,
  ) {}

  /**
   * Gets the player that the VoteResult belongs to
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player that was voted for.
   *
   * @returns The player that was voted for, or `undefined` if the vote was to skip or the player did not cast a vote
   */
  getVotedFor(): PlayerInstance | undefined {
    return this.skipped ? undefined : this.votedFor;
  }

  /**
   * Sets the player that was voted for.
   *
   * @param votedFor - The player that was voted for, or `undefined` to indicate that the player did not cast a vote
   */
  setVotedFor(votedFor?: PlayerInstance): void {
    this.votedFor = votedFor;
  }

  /**
   * Gets whether or not the vote was to skip.
   *
   * @returns `true` if the vote was to skip, `false` if not
   */
  isSkipping(): boolean {
    return this.skipped;
  }

  /**
   * Sets whether or not the vote was to skip.
   *
   * @param isSkipping - `true` to set the vote to skip, `false` for a regular vote or to indicate that the player did not cast a vote (default `true`)
   */
  setSkipping(isSkipping: boolean = true): void {
    this.skipped = isSkipping;
  }

  /**
   * Gets whether or not the player cast a vote.
   *
   * @returns `true` if the player voted to skip or exile another player, `false` if the player did not cast a vote
   */
  didVote(): boolean {
    return this.skipped || this.votedFor !== undefined;
  }
}
