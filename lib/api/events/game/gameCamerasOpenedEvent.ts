import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when a player has started viewing security cameras.
 */
export class GameCamerasOpenedEvent {
  constructor(
    private readonly game: Game,
    private readonly player: PlayerInstance,
  ) {}

  getGame(): Game {
    return this.game;
  }

  getPlayer(): PlayerInstance {
    return this.player;
  }
}
