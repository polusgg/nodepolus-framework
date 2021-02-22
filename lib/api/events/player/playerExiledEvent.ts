import { PlayerDiedEvent } from "./playerDiedEvent";
import { DeathReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";

/**
 * Fired when a player has been exiled at the end of a meeting.
 */
export class PlayerExiledEvent extends PlayerDiedEvent {
  /**
   * @param player - The player that died
   * @param voters - The players who voted to exile the player
   */
  constructor(
    player: PlayerInstance,
    protected readonly voters: PlayerInstance[],
  ) {
    super(player, DeathReason.Exile);
  }

  /**
   * Gets the players who voted to exile the player.
   */
  getVoters(): PlayerInstance[] {
    return this.voters;
  }
}
