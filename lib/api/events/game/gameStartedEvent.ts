import { CancellableEvent } from "..";
import { Player } from "../../player";
import { Game } from "../../game";

export class GameStartedEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public starter: Player,
    public impostors: Player[],
  ) {
    super();
  }
}
