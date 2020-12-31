import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

export class PlayerExiledEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
  ) {
    super();
  }
}
