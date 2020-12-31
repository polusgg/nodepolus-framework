import { PlayerSkin } from "../../../types/enums";
import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerSetSkinEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldSkin: PlayerSkin,
    public readonly newSkin: PlayerSkin,
  ) {
    super();
  }
}
