import { PlayerSkin } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's skin has been updated.
 */
export class PlayerSkinUpdatedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldSkin: PlayerSkin,
    public newSkin: PlayerSkin,
  ) {
    super();
  }
}
