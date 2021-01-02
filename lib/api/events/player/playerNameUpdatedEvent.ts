import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { TextComponent } from "../../text";

/**
 * Fired when a player's name has been updated.
 */
export class PlayerNameUpdatedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldName: TextComponent,
    public newName: TextComponent,
  ) {
    super();
  }
}
