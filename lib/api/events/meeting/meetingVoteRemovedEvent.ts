import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player's vote has been rescinded in a meeting.
 */
export class MeetingVoteRemovedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public player: PlayerInstance,
  ) {
    super();
  }
}
