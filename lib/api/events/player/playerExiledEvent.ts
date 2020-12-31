import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerExiledEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
  ) {
    super();
  }
}
