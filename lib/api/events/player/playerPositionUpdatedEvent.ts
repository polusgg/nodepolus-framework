import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

/**
 * Fired when a player's position has been updated, either by teleporting or by walking.
 */
export class PlayerPositionUpdatedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly kickedBy: PlayerInstance,
  ) {
    super();
  }
}
