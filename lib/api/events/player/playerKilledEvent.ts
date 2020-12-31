import { DeathReason } from "../../../types/enums";
import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";

export class PlayerKilledEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly deathReason: DeathReason = DeathReason.Unknown,
    public readonly killer?: PlayerInstance,
  ) {
    super();
  }
}
