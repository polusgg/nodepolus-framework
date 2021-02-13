import { ChatNoteType } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has sent a chat note in a lobby.
 */
export class PlayerChatNoteEvent extends CancellableEvent {
  /**
   * @param player - The player that sent the chat note
   * @param chatNoteType - The type of chat note that was sent
   */
  constructor(
    private readonly player: PlayerInstance,
    private chatNoteType: ChatNoteType,
  ) {
    super();
  }

  /**
   * Gets the player that sent the chat note.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the type of chat note that was sent.
   */
  getChatNoteType(): ChatNoteType {
    return this.chatNoteType;
  }

  /**
   * Sets the type of chat note that was sent.
   *
   * @param chatNoteType - The new type of chat note that was sent
   */
  setChatNoteType(chatNoteType: ChatNoteType): void {
    this.chatNoteType = chatNoteType;
  }
}
