import { PlayerInstance } from "../../player";
import { TextComponent } from "../../text";
import { CancellableEvent } from "..";

/**
 * Fired when a player's name has been updated.
 */
export class PlayerNameUpdatedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldName: TextComponent,
    public readonly newName: TextComponent,
  ) {
    super();
  }
}
