import { PlayerPet } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

export class PlayerSetPetEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldPet: PlayerPet,
    public readonly newPet: PlayerPet,
  ) {
    super();
  }
}
