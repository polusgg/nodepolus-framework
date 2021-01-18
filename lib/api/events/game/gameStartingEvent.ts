import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when the start-game countdown has finished and a game is starting.
 */
export class GameStartingEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
  ) {
    super();
  }

  /**
   * Gets the game that is starting.
   */
  getGame(): Game {
    return this.game;
  }
}
