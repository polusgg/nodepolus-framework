import { PlayerDiedEvent } from "./playerDiedEvent";
import { DeathReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";

/**
 * Fired when a player has been killed by another player.
 */
export class PlayerMurderedEvent extends PlayerDiedEvent {
  constructor(
    player: PlayerInstance,
    killer: PlayerInstance,
  ) {
    super(player, DeathReason.Murder, killer);
  }
}
