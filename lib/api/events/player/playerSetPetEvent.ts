import { PlayerPet } from "../../../types/enums";
import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerSetPetEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly oldPet: PlayerPet,
    public readonly newPet: PlayerPet,
  ) {
    super();
  }
}
