import { PlayerSkin } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's skin has been updated.
 */
export class PlayerSkinUpdatedEvent extends CancellableEvent {
  /**
   * @param player The player whose skin was updated
   * @param oldSkin The player's old skin
   * @param newSkin The player's new skin
   */
  constructor(
    private readonly player: PlayerInstance,
    private readonly oldSkin: PlayerSkin,
    private newSkin: PlayerSkin,
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
   * Gets the player's new skin.
   */
  getNewSkin(): PlayerSkin {
    return this.newSkin;
  }

  /**
   * Sets the player's new skin.
   *
   * @param newSkin The player's new skin
   */
  setNewSkin(newSkin: PlayerSkin): void {
    this.newSkin = newSkin;
  }
}
