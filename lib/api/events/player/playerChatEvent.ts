import { TextComponent } from "../../text";
import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerChatEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly message: TextComponent,
  ) {
    super();
  }
}
