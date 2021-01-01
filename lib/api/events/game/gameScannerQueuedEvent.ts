import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

/**
 * Fired when a player has entered the queue for a Medbay scanner.
 */
export class GameScannerQueuedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly kickedBy: PlayerInstance,
  ) {
    super();
  }
}
