import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when a player has entered the queue for a Medbay scanner.
 */
export class GameScannerQueuedEvent {
  /**
   * @param game The game from which this event was fired
   * @param player The player that entered the queue for the Medbay scanner
   * @param queue The queue for the Medbay scanner, *excluding* the player that entered
   */
  constructor(
    private readonly game: Game,
    private readonly player: PlayerInstance,
    private readonly queue: Readonly<Set<PlayerInstance>>,
  ) {}

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the player that entered the queue for the Medbay scanner.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the queue for the Medbay scanner, *excluding* the player that entered.
   */
  getQueue(): Readonly<Set<PlayerInstance>> {
    return this.queue;
  }
}
