import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerKickedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly kickedBy: PlayerInstance,
  ) {
    super();
  }
}
