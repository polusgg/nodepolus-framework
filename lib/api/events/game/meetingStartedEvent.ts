import { CancellableEvent } from "../cancellableEvent";
import { Player } from "../../player";
import { Game } from "../../game";

export class MeetingStartedEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public player: Player,
    public victim?: Player,
  ) {
    super();
  }
}
