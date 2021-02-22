import { PlayerColor } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's color has been updated.
 */
export class PlayerColorUpdatedEvent extends CancellableEvent {
  /**
   * @param player - The player whose color was updated
   * @param oldColor - The player's old color
   * @param newColor - The player's new color
   */
  constructor(
    protected readonly player: PlayerInstance,
    protected readonly oldColor: PlayerColor,
    protected newColor: PlayerColor,
  ) {
    super();
  }

  /**
   * Gets the player whose color was updated.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player's old color.
   */
  getOldColor(): PlayerColor {
    return this.oldColor;
  }

  /**
   * Gets the player's new color.
   */
  getNewColor(): PlayerColor {
    return this.newColor;
  }

  /**
   * Sets the player's new color.
   *
   * @param newColor - The player's new color
   */
  setNewColor(newColor: PlayerColor): void {
    this.newColor = newColor;
  }
}
