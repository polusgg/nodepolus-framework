import { CancellableEvent } from "..";
import { Player } from "../../player";

export class KickedEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly kickedBy: Player,
  ) {
    super();
  }
}
