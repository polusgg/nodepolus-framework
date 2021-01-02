import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { TextComponent } from "../../text";

/**
 * Fired when a player has sent a chat message in a lobby.
 */
export class PlayerChatMessageEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public message: TextComponent,
  ) {
    super();
  }
}
