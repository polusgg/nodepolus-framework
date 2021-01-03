import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has cast a vote to kick another player.
 */
export class PlayerVotekickAddedEvent extends CancellableEvent {
  constructor(
    private readonly voter: PlayerInstance,
    private target: PlayerInstance,
  ) {
    super();
  }

  getVoter(): PlayerInstance {
    return this.voter;
  }

  getTarget(): PlayerInstance {
    return this.target;
  }

  setTarget(target: PlayerInstance): void {
    this.target = target;
  }
}
