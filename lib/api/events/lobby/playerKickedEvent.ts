import { CancellableEvent } from "..";
import { Player } from "../../player";

export class PlayerKickedEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly kickedBy: Player,
  ) {
    super();
  }
}
