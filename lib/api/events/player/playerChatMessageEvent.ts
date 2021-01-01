import { PlayerInstance } from "../../player";
import { TextComponent } from "../../text";
import { CancellableEvent } from "..";

/**
 * Fired when a player has sent a chat message in a lobby.
 */
export class PlayerChatMessageEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly message: TextComponent,
  ) {
    super();
  }
}
