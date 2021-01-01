import { PlayerInstance } from "../../player";
import { CancellableEvent } from "..";

/**
 * Fired when a player's vote has been rescinded in a meeting.
 */
export class MeetingVoteRemovedEvent extends CancellableEvent {
  constructor(
    public readonly player: PlayerInstance,
    public readonly kickedBy: PlayerInstance,
  ) {
    super();
  }
}
