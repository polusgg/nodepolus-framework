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
   * @param killer - The player that killed the victim
   */
  constructor(
    private readonly player: PlayerInstance,
    private readonly reason: DeathReason,
    private readonly killer?: PlayerInstance,
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

  /**
   * Gets the player that killed the victim.
   *
   * @returns The murderer, or `undefined` if the player was killed via the API or exiled after a meeting
   */
  getKiller(): PlayerInstance | undefined {
    return this.killer;
  }
}
