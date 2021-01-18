import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Vector2 } from "../../../types";

/**
 * Fired when a player's position has been updated, either by teleporting or by walking.
 */
export class PlayerPositionUpdatedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly oldPosition: Vector2,
    private readonly oldVelocity: Vector2,
    private newPosition: Vector2,
    private newVelocity: Vector2,
  ) {
    super();
  }

  /**
   * Gets the player whose position was updated.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  getOldPosition(): Vector2 {
    return this.oldPosition;
  }

  getOldVelocity(): Vector2 {
    return this.oldVelocity;
  }

  getNewPosition(): Vector2 {
    return this.newPosition;
  }

  setNewPosition(newPosition: Vector2): void {
    this.newPosition = newPosition;
  }

  getNewVelocity(): Vector2 {
    return this.newVelocity;
  }

  setNewVelocity(newVelocity: Vector2): void {
    this.newVelocity = newVelocity;
  }
}
