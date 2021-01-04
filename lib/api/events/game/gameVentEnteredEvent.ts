import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { LevelVent } from "../../../types";
import { Game } from "../../game";

/**
 * Fired when a player has entered a vent.
 */
export class GameVentEnteredEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private readonly player: PlayerInstance,
    private vent: LevelVent,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getVent(): LevelVent {
    return this.vent;
  }

  setVent(vent: LevelVent): void {
    this.vent = vent;
  }
}
