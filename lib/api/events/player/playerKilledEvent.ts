import { DeathReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

export class PlayerKilledEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly deathReason: DeathReason = DeathReason.Unknown,
    public readonly killer?: PlayerInstance,
  ) {
    super();
  }
}
