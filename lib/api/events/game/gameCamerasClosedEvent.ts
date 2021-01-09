import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when a player has stopped viewing security cameras.
 */
export class GameCamerasClosedEvent {
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
