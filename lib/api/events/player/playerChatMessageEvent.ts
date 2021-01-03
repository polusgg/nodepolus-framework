import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { TextComponent } from "../../text";

/**
 * Fired when a player has sent a chat message in a lobby.
 */
export class PlayerChatMessageEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private message: TextComponent,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getMessage(): TextComponent {
    return this.message;
  }

  setMessage(message: TextComponent): void {
    this.message = message;
  }
}
