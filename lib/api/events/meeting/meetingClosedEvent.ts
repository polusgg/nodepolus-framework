import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

/**
 * Fired when a meeting window has been closed.
 */
export class MeetingClosedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly kickedBy: PlayerInstance,
  ) {
    super();
  }
}
