import { PlayerPositionUpdatedEvent } from "./playerPositionUpdatedEvent";
import { TeleportReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { Vector2 } from "../../../types";

/**
 * Fired when a player has teleported to another location, typically by using vents.
 */
export class PlayerPositionTeleportedEvent extends PlayerPositionUpdatedEvent {
  /**
   * @param player - The player whose position was updated
   * @param oldPosition - The player's old position
   * @param oldVelocity - The player's old velocity
   * @param newPosition - The player's new position
   * @param newVelocity - The player's new velocity
   * @param reason - The reason for why the player was teleported
   */
  constructor(
    player: PlayerInstance,
    oldPosition: Vector2,
    oldVelocity: Vector2,
    newPosition: Vector2,
    newVelocity: Vector2,
    protected readonly reason: TeleportReason,
  ) {
    super(player, oldPosition, oldVelocity, newPosition, newVelocity);
  }

  /**
   * This method is a no-op as teleporting sets the player velocity to `0, 0`.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setNewVelocity(_newVelocity: Vector2): void {}

  /**
   * Gets the reason for why the player was teleported.
   */
  getReason(): TeleportReason {
    return this.reason;
  }
}
