import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has cast a vote to kick another player.
 */
export class PlayerVotekickAddedEvent extends CancellableEvent {
  /**
   * @param voter - The player that cast the vote
   * @param target - The player that was voted to be kicked by the voting player
   */
  constructor(
    protected readonly voter: PlayerInstance,
    protected target: PlayerInstance,
  ) {
    super();
  }

  /**
   * Gets the player that cast the vote.
   */
  getVoter(): PlayerInstance {
    return this.voter;
  }

  /**
   * Gets the player that was voted to be kicked by the voting player.
   */
  getTarget(): PlayerInstance {
    return this.target;
  }

  /**
   * Sets the player that was voted to be kicked by the voting player.
   *
   * @param target - The new player that voted to be kicked by the voting player
   */
  setTarget(target: PlayerInstance): void {
    this.target = target;
  }
}
