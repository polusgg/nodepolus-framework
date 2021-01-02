import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Vector2 } from "../../../types";

/**
 * Fired when a player has teleported to another location, typically by using vents.
 */
export class PlayerPositionTeleportedEvent extends CancellableEvent {
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
