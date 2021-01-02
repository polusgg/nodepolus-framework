import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has cast a vote in a meeting.
 */
export class MeetingVoteAddedEvent extends CancellableEvent {
  constructor(
    public readonly game: Game,
    public player: PlayerInstance,
    public suspect: PlayerInstance,
  ) {
    super();
  }
}
