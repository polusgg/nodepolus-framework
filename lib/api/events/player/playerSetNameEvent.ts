import { TextComponent } from "../../text";
import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerSetNameEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldName: TextComponent,
    public readonly newName: TextComponent,
  ) {
    super();
  }
}
