import { PlayerHat } from "../../../types/enums";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class PlayerSetHatEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldHat: PlayerHat,
    public readonly newHat: PlayerHat,
  ) {
    super();
  }
}
