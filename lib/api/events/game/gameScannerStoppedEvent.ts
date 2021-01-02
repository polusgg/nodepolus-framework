import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has stopped scanning on a Medbay scanner.
 */
export class GameScannerStoppedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public readonly player: PlayerInstance,
    public readonly didFinishScanning: boolean,
  ) {
    super();
  }
}
