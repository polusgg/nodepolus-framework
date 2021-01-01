import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";
import { Game } from "../../game";

/**
 * Fired when a meeting has begun.
 */
export class MeetingStartedEvent extends CancellableEvent {
  constructor(
    public game: Game,
    public player: PlayerInstance,
    public victim?: PlayerInstance,
  ) {
    super();
  }
}
