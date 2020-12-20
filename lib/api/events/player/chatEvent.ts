import { TextComponent } from "../../text";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class ChatEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly message: TextComponent,
  ) {
    super();
  }
}
