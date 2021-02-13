import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's vote to kick another player has been rescinded.
 */
export class PlayerVotekickRemovedEvent extends CancellableEvent {
  /**
   * @param voter - The player whose vote is being cleared
   * @param target - The player for which the voting player's vote is being cleared
   */
  constructor(
    private readonly voter: PlayerInstance,
    private readonly target: PlayerInstance,
  ) {
    super();
  }

  /**
   * Gets the player whose vote is being cleared.
   */
  getVoter(): PlayerInstance {
    return this.voter;
  }

  /**
   * Gets the player for which the voting player's vote is being cleared.
   */
  getTarget(): PlayerInstance {
    return this.target;
  }
}
