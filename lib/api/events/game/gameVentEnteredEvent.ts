import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game, Vent } from "../../game";

/**
 * Fired when a player has entered a vent.
 */
export class GameVentEnteredEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public readonly player: PlayerInstance,
    public readonly vent: Vent,
  ) {
    super();
  }
}
