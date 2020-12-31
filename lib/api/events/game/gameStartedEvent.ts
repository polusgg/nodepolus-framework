import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";
import { Game } from "../../game";

export class GameStartedEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public starter: PlayerInstance,
    public impostors: PlayerInstance[],
  ) {
    super();
  }
}
