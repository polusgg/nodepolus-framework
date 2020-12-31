import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";
import { Vent } from "../../game";

export class VentEnterEvent extends CancellableEvent {
  constructor(
    public player: PlayerInstance,
    public vent: Vent,
  ) {
    super();
  }
}
