import { GameOverReason } from "../../../types/enums";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a game has ended.
 */
export class GameEndedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private reason: GameOverReason,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getReason(): GameOverReason {
    return this.reason;
  }

  setReason(reason: GameOverReason): void {
    this.reason = reason;
  }
}
