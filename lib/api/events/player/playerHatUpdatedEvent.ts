import { PlayerHat } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's hat has been updated.
 */
export class PlayerHatUpdatedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly oldHat: PlayerHat,
    private newHat: PlayerHat,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getOldHat(): PlayerHat {
    return this.oldHat;
  }

  getNewHat(): PlayerHat {
    return this.newHat;
  }

  setNewHat(newHat: PlayerHat): void {
    this.newHat = newHat;
  }
}
