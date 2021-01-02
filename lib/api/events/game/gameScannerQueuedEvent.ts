import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has entered the queue for a Medbay scanner.
 */
export class GameScannerQueuedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public readonly player: PlayerInstance,
    public queue: PlayerInstance[],
  ) {
    super();
  }
}
