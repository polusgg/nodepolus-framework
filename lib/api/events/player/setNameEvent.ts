import { CancellableEvent } from "../cancellableEvent";
import { TextComponent } from "../../text";
import { Player } from "../../player";

export class SetNameEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldName: TextComponent,
    public readonly newName: TextComponent,
  ) {
    super();
  }
}
