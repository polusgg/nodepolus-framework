import { CancellableEvent } from "../cancellableEvent";
import { PlayerColor } from "../../../types/enums";
import { Player } from "../../player";

export class SetColorEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldColor: PlayerColor,
    public readonly newColor: PlayerColor,
  ) {
    super();
  }
}
