import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has been brought back to life.
 */
export class PlayerRevivedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }
}
