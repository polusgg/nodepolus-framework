import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has satarted scanning on a Medbay scanner.
 */
export class GameScannerStartedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param player - The player that started scanning on the Medbay scanner
   */
  constructor(
    protected readonly game: Game,
    protected readonly player: PlayerInstance,
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
   * Gets the player that started scanning on the Medbay scanner.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }
}
