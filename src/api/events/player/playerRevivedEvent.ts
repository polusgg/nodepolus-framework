import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has been brought back to life.
 */
export class PlayerRevivedEvent extends CancellableEvent {
  /**
   * @param player - The player that was revived
   */
  constructor(
    protected readonly player: PlayerInstance,
  ) {
    super();
  }

  /**
   * Gets the player that was revived.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }
}
