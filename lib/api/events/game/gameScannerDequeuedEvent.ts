import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has left the queue for a Medbay scanner.
 */
export class GameScannerDequeuedEvent extends CancellableEvent {
  /**
   * @param game The game from which this event was fired
   * @param player The player that left the queue for the Medbay scanner
   * @param queue The queue for the Medbay scanner, *excluding* the player that left
   */
  constructor(
    private readonly game: Game,
    private readonly player: PlayerInstance,
    private queue: Set<PlayerInstance>,
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
   * Gets the player that left the queue for the Medbay scanner.
   */
  getPlayer(): PlayerInstance {
    return this.player;
  }

  /**
   * Gets the queue for the Medbay scanner, *excluding* the player that left.
   */
  getQueue(): Set<PlayerInstance> {
    return this.queue;
  }

  /**
   * Sets the queue for the Medbay scanner.
   *
   * @param queue The new queue for the Medbay scanner
   */
  setQueue(queue: Set<PlayerInstance>): void {
    this.queue = queue;
  }
}
