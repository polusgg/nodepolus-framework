import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";
import { Game } from "../../game";

export class MeetingEndedEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public isTie: boolean,
    public exiled?: PlayerInstance,
    // TODO: Include final vote states
  ) {
    super();
  }
}
