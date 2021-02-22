import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { TextComponent } from "../../text";

/**
 * Fired when a player has sent a chat message in a lobby.
 */
export class PlayerChatMessageEvent extends CancellableEvent {
  /**
   * @param player - The player that sent the chat message
   * @param message - The chat message
   */
  constructor(
    protected readonly player: PlayerInstance,
    protected message: TextComponent,
  ) {
    super();
  }

  /**
   * Gets the player that sent the chat message.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the chat message.
   */
  getMessage(): TextComponent {
    return this.message;
  }

  /**
   * Sets the chat message.
   *
   * @param message - The new chat message
   */
  setMessage(message: TextComponent): void {
    this.message = message;
  }
}
