import { GameOverReason } from "../../../types/enums";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a game has ended.
 */
export class GameEndedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public gameOverReason: GameOverReason,
  ) {
    super();
  }
}
