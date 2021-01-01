import { DeathReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

/**
 * Fired when a player has been killed by another player.
 */
export class PlayerMurderedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly deathReason: DeathReason = DeathReason.Unknown,
    public readonly killer?: PlayerInstance,
  ) {
    super();
  }
}
