import { PlayerHat } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

export class PlayerSetHatEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldHat: PlayerHat,
    public readonly newHat: PlayerHat,
  ) {
    super();
  }
}
