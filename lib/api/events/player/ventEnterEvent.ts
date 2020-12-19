import { CancellableEvent } from "../cancellableEvent";
import { Player } from "../../player";
import Vent from "../../game/vent";

export class VentEnterEvent extends CancellableEvent {
  constructor(
    public player: Player,
    public vent: Vent,
  ) {
    super();
  }
}
