import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has left the queue for a Medbay scanner.
 */
export class GameScannerDequeuedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private readonly player: PlayerInstance,
    private readonly startedScanning: boolean,
    private queue: Set<PlayerInstance>,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  didStartScanning(): boolean {
    return this.startedScanning;
  }

  getQueue(): Set<PlayerInstance> {
    return this.queue;
  }

  setQueue(queue: Set<PlayerInstance>): void {
    this.queue = queue;
  }
}
