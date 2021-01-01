import { ChatNoteType } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

/**
 * Fired when a player has sent a chat note in a lobby.
 */
export class PlayerChatNoteEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly chatNoteType: ChatNoteType,
  ) {
    super();
  }
}
