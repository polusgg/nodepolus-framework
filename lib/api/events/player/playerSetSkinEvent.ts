import { PlayerSkin } from "../../../types/enums";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class PlayerSetSkinEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldSkin: PlayerSkin,
    public readonly newSkin: PlayerSkin,
  ) {
    super();
  }
}
