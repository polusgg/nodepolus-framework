import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has started viewing security cameras.
 */
export class GameCamerasOpenedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private readonly player: PlayerInstance,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }
}