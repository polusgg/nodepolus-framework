import { PlayerPet } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player's pet has been updated.
 */
export class PlayerPetUpdatedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldPet: PlayerPet,
    public newPet: PlayerPet,
  ) {
    super();
  }
}
