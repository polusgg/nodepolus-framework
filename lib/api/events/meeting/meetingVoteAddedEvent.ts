import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has cast a vote in a meeting.
 */
export class MeetingVoteAddedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param voter - The player that cast the vote
   * @param suspect - The player that was voted to be exiled by the voting player
   */
  constructor(
    protected readonly game: Game,
    protected voter: PlayerInstance,
    protected suspect?: PlayerInstance,
  ) {
    super();
  }

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the player that cast the vote.
   */
  getVoter(): PlayerInstance {
    return this.voter;
  }

  /**
   * Sets the player that cast the vote.
   *
   * @param voter - The new player that cast the vote
   */
  setVoter(voter: PlayerInstance): void {
    this.voter = voter;
  }

  /**
   * Gets the player that was voted to be exiled by the voting player.
   *
   * @returns The player that was voted to be exiled, or `undefined` if the voting player voted to skip
   */
  getSuspect(): PlayerInstance | undefined {
    return this.suspect;
  }

  /**
   * Sets the player that was voted to be exiled by the voting player.
   *
   * @param suspect - The new player that was voted to be exiled
   */
  setSuspect(suspect?: PlayerInstance): void {
    this.suspect = suspect;
  }
}
