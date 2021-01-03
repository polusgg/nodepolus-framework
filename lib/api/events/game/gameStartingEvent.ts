import { CancellableEvent } from "../types";
import { Game } from "../../game";

export class GameStartingEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }
}
