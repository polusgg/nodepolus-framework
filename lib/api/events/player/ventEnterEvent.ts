import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";
import { Vent } from "../../game";

export class VentEnterEvent extends CancellableEvent {
  constructor(
    public player: PlayerInstance,
    public vent: Vent,
  ) {
    super();
  }
}
