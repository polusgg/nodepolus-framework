import { PlayerDiedEvent } from "./playerDiedEvent";
import { DeathReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";

/**
 * Fired when a player has been killed by another player.
 */
export class PlayerMurderedEvent extends PlayerDiedEvent {
  /**
   * @param player The player that died
   * @param killer The player that killed the victim
   */
  constructor(
    player: PlayerInstance,
    killer: PlayerInstance,
  ) {
    super(player, DeathReason.Murder, killer);
  }
}
