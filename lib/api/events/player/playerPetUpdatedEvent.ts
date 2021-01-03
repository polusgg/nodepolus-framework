import { PlayerPet } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's pet has been updated.
 */
export class PlayerPetUpdatedEvent extends CancellableEvent {
  constructor(
    private readonly player: PlayerInstance,
    private readonly oldPet: PlayerPet,
    private newPet: PlayerPet,
  ) {
    super();
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getOldPet(): PlayerPet {
    return this.oldPet;
  }

  getNewPet(): PlayerPet {
    return this.newPet;
  }

  setNewPet(newPet: PlayerPet): void {
    this.newPet = newPet;
  }
}
