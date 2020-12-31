import { CancellableEvent } from "..";
import { PlayerInstance } from "../../player";
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
