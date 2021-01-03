import { PlayerSkin } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's skin has been updated.
 */
export class PlayerSkinUpdatedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly oldSkin: PlayerSkin,
    private newSkin: PlayerSkin,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getOldSkin(): PlayerSkin {
    return this.oldSkin;
  }

  getNewSkin(): PlayerSkin {
    return this.newSkin;
  }

  setNewSkin(newSkin: PlayerSkin): void {
    this.newSkin = newSkin;
  }
}
