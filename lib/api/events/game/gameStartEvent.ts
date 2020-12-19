import { CancellableEvent } from "../cancellableEvent";
import { Player } from "../../player";
import { Game } from "../../game";

export class GameStartEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public starter: Player,
    public timer: number,
  ) {
    super();
  }
}
