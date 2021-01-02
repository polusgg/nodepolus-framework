import { DeathReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has died, either by being exiled or by being murdered.
 */
export class PlayerDiedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly deathReason: DeathReason,
    public readonly killer?: PlayerInstance,
  ) {
    super();
  }
}
