import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";
import { Game } from "../../game";

export class MeetingStartedEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public player: PlayerInstance,
    public victim?: PlayerInstance,
  ) {
    super();
  }
}
