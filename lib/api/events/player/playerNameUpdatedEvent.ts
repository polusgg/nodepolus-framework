import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { TextComponent } from "../../text";

/**
 * Fired when a player's name has been updated.
 */
export class PlayerNameUpdatedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly oldName: TextComponent,
    private newName: TextComponent,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getOldName(): TextComponent {
    return this.oldName;
  }

  getNewName(): TextComponent {
    return this.newName;
  }

  setNewName(newName: TextComponent): void {
    this.newName = newName;
  }
}
