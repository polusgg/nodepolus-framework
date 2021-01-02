import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has left the queue for a Medbay scanner.
 */
export class GameScannerDequeuedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public readonly player: PlayerInstance,
    public readonly didStartScanning: boolean,
    public queue: PlayerInstance[],
  ) {
    super();
  }
}
