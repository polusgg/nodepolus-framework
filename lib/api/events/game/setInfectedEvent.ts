import { CancellableEvent } from "..";
import { Player } from "../../player";
import { Game } from "../../game";

export class SetInfectedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public readonly impostors: Player[],
  ) {
    super();
  }
}
