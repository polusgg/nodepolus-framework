import { CancellableEvent } from "../cancellableEvent";
import { PlayerSkin } from "../../../types/enums";
import { Player } from "../../player";

export class SetSkinEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldSkin: PlayerSkin,
    public readonly newSkin: PlayerSkin,
  ) {
    super();
  }
}
