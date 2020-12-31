import { PlayerColor } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

export class PlayerSetColorEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldColor: PlayerColor,
    public readonly newColor: PlayerColor,
  ) {
    super();
  }
}
