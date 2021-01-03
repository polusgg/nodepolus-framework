import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's vote to kick another player has been rescinded.
 */
export class PlayerVotekickRemovedEvent extends CancellableEvent {
  constructor(
    private readonly voter: PlayerInstance,
    private readonly target: PlayerInstance,
  ) {
    super();
  }

  getVoter(): PlayerInstance {
    return this.voter;
  }

  getTarget(): PlayerInstance {
    return this.target;
  }
}
