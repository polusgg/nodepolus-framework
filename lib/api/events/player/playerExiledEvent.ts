import { PlayerDiedEvent } from "./playerDiedEvent";
import { DeathReason } from "../../../types/enums";
import { PlayerInstance } from "../../player";

/**
 * Fired when a player has been exiled at the end of a meeting.
 */
export class PlayerExiledEvent extends PlayerDiedEvent {
  constructor(
    player: PlayerInstance,
    private readonly voters: PlayerInstance[],
  ) {
    super(player, DeathReason.Exile);
  }

  getVoters(): PlayerInstance[] {
    return this.voters;
  }
}
