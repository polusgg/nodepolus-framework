import { PlayerPet } from "../../../types/enums";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class PlayerSetPetEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldPet: PlayerPet,
    public readonly newPet: PlayerPet,
  ) {
    super();
  }
}
