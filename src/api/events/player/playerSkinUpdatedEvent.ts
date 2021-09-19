import { PlayerSkin, SetCosmeticReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's skin has been updated.
 */
export class PlayerSkinUpdatedEvent extends CancellableEvent {
  /**
   * @param player - The player whose skin was updated
   * @param oldSkin - The player's old skin
   * @param newSkin - The player's new skin
   */
  constructor(
    protected readonly player: PlayerInstance,
    protected readonly oldSkin: PlayerSkin,
    protected newSkin: PlayerSkin,
    protected reason: SetCosmeticReason
  ) {
    super();
  }

  /**
   * Gets the player whose skin was updated.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player's old skin.
   */
  getOldSkin(): PlayerSkin {
    return this.oldSkin;
  }

  /**
   * Get the reason for why the player's hat is being updated.
   */
  getReason(): SetCosmeticReason {
    return this.reason
  }

  /**
   * Gets the player's new skin.
   */
  getNewSkin(): PlayerSkin {
    return this.newSkin;
  }

  /**
   * Sets the player's new skin.
   *
   * @param newSkin - The player's new skin
   */
  setNewSkin(newSkin: PlayerSkin): this {
    this.newSkin = newSkin;

    return this;
  }
}
