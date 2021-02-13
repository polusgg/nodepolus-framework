import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { TextComponent } from "../../text";

/**
 * Fired when a player's name has been updated.
 */
export class PlayerNameUpdatedEvent extends CancellableEvent {
  /**
   * @param player - The player whose name was updated
   * @param oldName - The player's old name
   * @param newName - The player's new name
   */
  constructor(
    private readonly player: PlayerInstance,
    private readonly oldName: TextComponent,
    private newName: TextComponent,
  ) {
    super();
  }

  /**
   * Gets the player whose name was updated.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player's old name.
   */
  getOldName(): TextComponent {
    return this.oldName;
  }

  /**
   * Gets the player's new name.
   */
  getNewName(): TextComponent {
    return this.newName;
  }

  /**
   * Sets the player's new name.
   *
   * @param newName - The player's new name
   */
  setNewName(newName: TextComponent): void {
    this.newName = newName;
  }
}
