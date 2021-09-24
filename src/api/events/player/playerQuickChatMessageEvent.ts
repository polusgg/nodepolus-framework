import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { QuickChatPhrase, QuickChatPlayer, QuickChatSentence } from "../../../protocol/packets/rpc/sendQuickChatPacket";

/**
 * Fired when a player has sent a chat message in a lobby.
 */
export class PlayerQuickChatMessageEvent extends CancellableEvent {
  /**
   * @param player - The player that sent the chat message
   * @param message - The chat message
   */
  constructor(
    protected readonly player: PlayerInstance,
    protected value?: QuickChatPhrase | QuickChatPlayer | QuickChatSentence
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
  getMessage(): QuickChatPhrase | QuickChatPlayer | QuickChatSentence | undefined {
    return this.value;
  }

  /**
   * Sets the chat message.
   *
   * @param message - The new chat message
   */
  setMessage(message: QuickChatPhrase | QuickChatPlayer | QuickChatSentence | undefined): this {
    this.value = message;

    return this;
  }
}
