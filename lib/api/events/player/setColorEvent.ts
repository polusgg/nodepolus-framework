import { PlayerColor } from "../../../types/playerColor";
import { CancellableEvent } from "../cancellableEvent";
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
