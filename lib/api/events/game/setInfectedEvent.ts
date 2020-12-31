import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";
import { Game } from "../../game";

export class SetInfectedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public readonly impostors: PlayerInstance[],
  ) {
    super();
  }
}
