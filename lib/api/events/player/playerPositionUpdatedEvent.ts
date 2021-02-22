import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Vector2 } from "../../../types";

/**
 * Fired when a player's position has been updated, either by teleporting or by walking.
 */
export class PlayerPositionUpdatedEvent extends CancellableEvent {
  /**
   * @param player - The player whose position was updated
   * @param oldPosition - The player's old position
   * @param oldVelocity - The player's old velocity
   * @param newPosition - The player's new position
   * @param newVelocity - The player's new velocity
   */
  constructor(
    protected readonly player: PlayerInstance,
    protected readonly oldPosition: Vector2,
    protected readonly oldVelocity: Vector2,
    protected newPosition: Vector2,
    protected newVelocity: Vector2,
  ) {
    super();
  }

  /**
   * Gets the player whose position was updated.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player's old position.
   */
  getOldPosition(): Vector2 {
    return this.oldPosition;
  }

  /**
   * Gets the player's old velocity.
   */
  getOldVelocity(): Vector2 {
    return this.oldVelocity;
  }

  /**
   * Gets the player's new position.
   */
  getNewPosition(): Vector2 {
    return this.newPosition;
  }

  /**
   * Sets the player's new position.
   *
   * @param newPosition - The player's new position
   */
  setNewPosition(newPosition: Vector2): void {
    this.newPosition = newPosition;
  }

  /**
   * Gets the player's new velocity.
   */
  getNewVelocity(): Vector2 {
    return this.newVelocity;
  }

  /**
   * Sets the player's new velocity.
   *
   * @param newVelocity - The player's new velocity
   */
  setNewVelocity(newVelocity: Vector2): void {
    this.newVelocity = newVelocity;
  }
}
