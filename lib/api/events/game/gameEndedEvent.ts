import { GameOverReason } from "../../../types/gameOverReason";
import { CancellableEvent } from "../cancellableEvent";
import { Game } from "../../game";

export class GameEndedEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public gameOverReason: GameOverReason,
  ) {
    super();
  }
}
