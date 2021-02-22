import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player's vote has been rescinded in a meeting.
 */
export class MeetingVoteRemovedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param player - The player whose vote is being cleared
   */
  constructor(
    protected readonly game: Game,
    protected player: PlayerInstance,
  ) {
    super();
  }

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the player whose vote is being cleared.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Sets the player whose vote is being cleared.
   *
   * @param player - The new player whose vote is being cleared
   */
  setPlayer(player: PlayerInstance): void {
    this.player = player;
  }
}
