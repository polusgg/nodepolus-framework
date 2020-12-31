import { PlayerColor } from "../../../types/enums";
import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerSetColorEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldColor: PlayerColor,
    public readonly newColor: PlayerColor,
  ) {
    super();
  }
}
