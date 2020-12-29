import { CancellableEvent } from "..";
import { Player } from "../../player";

export class PlayerExiledEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
  ) {
    super();
  }
}
