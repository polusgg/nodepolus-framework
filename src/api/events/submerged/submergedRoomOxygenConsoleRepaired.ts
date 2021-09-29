import { CancellableEvent } from "../types";
import { Game } from "../../game";
import { PlayerInstance } from "../../player";

/**
 * Fired when someone puts on a mask during an oxygen sabotage.
 */
export class SubmergedRoomOxygenConsoleRepairedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param player - The player that put on the mask
   */
  constructor(
    protected readonly game: Game,
    protected readonly player: PlayerInstance
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
   * Gets the player that put on a mask.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }
}
