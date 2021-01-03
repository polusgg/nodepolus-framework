import { ChatNoteType } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has sent a chat note in a lobby.
 */
export class PlayerChatNoteEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private chatNoteType: ChatNoteType,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getChatNoteType(): ChatNoteType {
    return this.chatNoteType;
  }

  setChatNoteType(chatNoteType: ChatNoteType): void {
    this.chatNoteType = chatNoteType;
  }
}
