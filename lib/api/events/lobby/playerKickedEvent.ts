import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

export class PlayerKickedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly kickedBy: PlayerInstance,
  ) {
    super();
  }
}
