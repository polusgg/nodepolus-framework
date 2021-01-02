import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has started viewing security cameras.
 */
export class GameCamerasOpenedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public readonly player: PlayerInstance,
  ) {
    super();
  }
}
