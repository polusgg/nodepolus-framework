import { TextComponent } from "../../text";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class PlayerSetNameEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldName: TextComponent,
    public readonly newName: TextComponent,
  ) {
    super();
  }
}
