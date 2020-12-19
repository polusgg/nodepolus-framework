import { CancellableEvent } from "../cancellableEvent";
import { PlayerPet } from "../../../types/playerPet";
import { Player } from "../../player";

export class SetPetEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly oldPet: PlayerPet,
    public readonly newPet: PlayerPet,
  ) {
    super();
  }
}
