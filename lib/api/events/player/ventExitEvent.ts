import { CancellableEvent } from "..";
import { Player } from "../../player";
import { Vent } from "../../game";

export class VentExitEvent extends CancellableEvent {
  constructor(
    public player: Player,
    public vent: Vent,
  ) {
    super();
  }
}
