import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";
import { Game } from "../../game";

export class GameStartEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public starter: PlayerInstance,
    public secondsLeft: number,
  ) {
    super();
  }
}
