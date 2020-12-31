import { PlayerSkin } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

export class PlayerSetSkinEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldSkin: PlayerSkin,
    public readonly newSkin: PlayerSkin,
  ) {
    super();
  }
}
