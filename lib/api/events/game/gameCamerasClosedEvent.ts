import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when a player has stopped viewing security cameras.
 */
export class GameCamerasClosedEvent {
  /**
   * @param game - The game from which this event was fired
   * @param player - The player that stopped viewing security cameras
   */
  constructor(
    private readonly game: Game,
    private readonly player: PlayerInstance,
  ) {}

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the player that stopped viewing security cameras.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }
}
