import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game, Vent } from "../../game";

/**
 * Fired when a player has entered a vent.
 */
export class GameVentEnteredEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private readonly player: PlayerInstance,
    private readonly vent: Vent,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getVent(): Vent {
    return this.vent;
  }
}
