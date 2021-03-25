import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when a player has started viewing security cameras.
 */
export class GameCamerasOpenedEvent {
  /**
   * @param game - The game from which this event was fired
   * @param player - The player that started viewing security cameras
   */
  constructor(
    protected readonly game: Game,
    protected readonly player: PlayerInstance,
  ) {}

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the player that started viewing security cameras.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }
}
