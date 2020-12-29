import { DeathReason } from "../../../types/enums";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class PlayerKilledEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly deathReason: DeathReason = DeathReason.Unknown,
    public readonly killer?: Player,
  ) {
    super();
  }
}
