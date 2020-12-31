import { PlayerHat } from "../../../types/enums";
import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerSetHatEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldHat: PlayerHat,
    public readonly newHat: PlayerHat,
  ) {
    super();
  }
}
