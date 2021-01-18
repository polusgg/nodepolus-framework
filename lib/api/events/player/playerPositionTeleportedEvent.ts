import { PlayerPositionUpdatedEvent } from "./playerPositionUpdatedEvent";
import { Vector2 } from "../../../types";

/**
 * Fired when a player has teleported to another location, typically by using vents.
 */
export class PlayerPositionTeleportedEvent extends PlayerPositionUpdatedEvent {
  /**
   * This method is a no-op as teleporting sets the player velocity to `0, 0`.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setNewVelocity(_newVelocity: Vector2): void {}
}
