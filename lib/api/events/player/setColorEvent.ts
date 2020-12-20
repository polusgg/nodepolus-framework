import { PlayerColor } from "../../../types/enums";
import { CancellableEvent } from "..";
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
