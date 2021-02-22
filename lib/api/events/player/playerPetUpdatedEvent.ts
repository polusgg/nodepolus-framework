import { PlayerPet } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's pet has been updated.
 */
export class PlayerPetUpdatedEvent extends CancellableEvent {
  /**
   * @param player - The player whose pet was updated
   * @param oldPet - The player's old pet
   * @param newPet - The player's new pet
   */
  constructor(
    protected readonly player: PlayerInstance,
    protected readonly oldPet: PlayerPet,
    protected newPet: PlayerPet,
  ) {
    super();
  }

  /**
   * Gets the player whose pet was updated.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the player's old pet.
   */
  getOldPet(): PlayerPet {
    return this.oldPet;
  }

  /**
   * Gets the player's new pet.
   */
  getNewPet(): PlayerPet {
    return this.newPet;
  }

  /**
   * Sets the player's new pet.
   *
   * @param newPet - The player's new pet
   */
  setNewPet(newPet: PlayerPet): void {
    this.newPet = newPet;
  }
}
