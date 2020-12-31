import { PlayerInstance } from "../../player";
import { TextComponent } from "../../text";
import { CancellableEvent } from "..";

export class PlayerChatEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly message: TextComponent,
  ) {
    super();
  }
}
