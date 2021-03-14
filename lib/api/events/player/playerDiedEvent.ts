import { DeathReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";

/**
 * Fired when a player has died, either by being exiled or by being murdered.
 */
export class PlayerDiedEvent extends CancellableEvent {
  /**
   * @param player - The player that died
   * @param reason - The reason for why the player died
   */
  constructor(
    protected readonly player: PlayerInstance,
    protected readonly reason: DeathReason,
  ) {
    super();
  }

  /**
   * Gets the player that died.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the reason for why the player died.
   */
  getReason(): DeathReason {
    return this.reason;
  }
}
