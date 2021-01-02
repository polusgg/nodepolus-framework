import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Vector2 } from "../../../types";

/**
 * Fired when a player has walked to another position.
 */
export class PlayerPositionWalkedEvent extends CancellableEvent {
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
