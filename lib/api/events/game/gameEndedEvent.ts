import { GameOverReason } from "../../../types/enums";
import { CancellableEvent } from "..";
import { Game } from "../../game";

export class GameEndedEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public gameOverReason: GameOverReason,
  ) {
    super();
  }
}
