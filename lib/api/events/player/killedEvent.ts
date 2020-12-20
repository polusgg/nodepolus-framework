import { DeathReason } from "../../../types/enums";
import { CancellableEvent } from "..";
import { Player } from "../../player";

export class KilledEvent extends CancellableEvent {
  constructor(
    public readonly player: Player,
    public readonly deathReason: DeathReason = DeathReason.Unknown,
    public readonly killer?: Player,
  ) {
    super();
  }
}
