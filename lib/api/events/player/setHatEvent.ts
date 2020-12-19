import { CancellableEvent } from "../cancellableEvent";
import { PlayerHat } from "../../../types/playerHat";
import { Player } from "../../player";

export class SetHatEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldHat: PlayerHat,
    public readonly newHat: PlayerHat,
  ) {
    super();
  }
}
