import { CancellableEvent } from "../cancellableEvent";
import { Player } from "../../player";
import { Game } from "../../game";

export class MeetingEndedEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public isTie: boolean,
    public exiled?: Player,
    // TODO: Include final vote states
  ) {
    super();
  }
}
