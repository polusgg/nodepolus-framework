import { CancellableEvent } from "..";
import { Player } from "../../player";
import { Game } from "../../game";

export class GameStartEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public starter: Player,
    public secondsLeft: number,
  ) {
    super();
  }
}
