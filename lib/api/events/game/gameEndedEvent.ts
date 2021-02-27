import { GameOverReason } from "../../../types/enums";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a game has ended.
 */
export class GameEndedEvent extends CancellableEvent {
  /**
   * @param game - The game that ended
   * @param reason - The reason for why the game ended
   */
  constructor(
    protected readonly game: Game,
    protected reason: GameOverReason,
  ) {
    super();
  }

  /**
   * Gets the game that ended.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the reason for why the game ended.
   */
  getReason(): GameOverReason {
    return this.reason;
  }

  /**
   * Sets the reason for why the game ended.
   *
   * @param reason - The new reason for why the game ended
   */
  setReason(reason: GameOverReason): this {
    this.reason = reason;

    return this;
  }
}
