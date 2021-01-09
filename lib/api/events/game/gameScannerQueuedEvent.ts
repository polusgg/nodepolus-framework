import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when a player has entered the queue for a Medbay scanner.
 */
export class GameScannerQueuedEvent {
  constructor(
    private readonly game: Game,
    private readonly player: PlayerInstance,
    private readonly queue: Readonly<Set<PlayerInstance>>,
  ) {}

  getGame(): Game {
    return this.game;
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getQueue(): Readonly<Set<PlayerInstance>> {
    return this.queue;
  }
}
