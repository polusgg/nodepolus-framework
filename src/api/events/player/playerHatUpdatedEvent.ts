import { PlayerHat, SetCosmeticReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's hat has been updated.
 */
export class PlayerHatUpdatedEvent extends CancellableEvent {
  /**
   * @param player - The player whose hat was updated
   * @param oldHat - The player's old hat
   * @param newHat - The player's new hat
   */
  constructor(
    protected readonly player: PlayerInstance,
    protected readonly oldHat: PlayerHat,
    protected newHat: PlayerHat,
    protected reason: SetCosmeticReason
  ) {
    super();
  }

  /**
   * Gets the player whose hat was updated.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player's old hat.
   */
  getOldHat(): PlayerHat {
    return this.oldHat;
  }

  /**
   * Get the reason for why the player's hat is being updated.
   */
  getReason(): SetCosmeticReason {
    return this.reason
  }

  /**
   * Gets the player's new hat.
   */
  getNewHat(): PlayerHat {
    return this.newHat;
  }

  /**
   * Sets the player's new hat.
   *
   * @param newHat - The player's new hat
   */
  setNewHat(newHat: PlayerHat): this {
    this.newHat = newHat;

    return this;
  }
}
