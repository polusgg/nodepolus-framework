import { TextComponent } from "../../text";
import { CancellableEvent } from "..";
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
