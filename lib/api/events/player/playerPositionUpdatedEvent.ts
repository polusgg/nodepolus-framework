import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Vector2 } from "../../../types";

/**
 * Fired when a player's position has been updated, either by teleporting or by walking.
 */
export class PlayerPositionUpdatedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldPosition: Vector2,
    public readonly oldVelocity: Vector2,
    public newPosition: Vector2,
    public newVelocity: Vector2,
  ) {
    super();
  }
}
