import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a player has cast a vote in a meeting.
 */
export class MeetingVoteAddedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private voter: PlayerInstance,
    private suspect?: PlayerInstance,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getVoter(): PlayerInstance {
    return this.voter;
  }

  setVoter(voter: PlayerInstance): void {
    this.voter = voter;
  }

  getSuspect(): PlayerInstance | undefined {
    return this.suspect;
  }

  setSuspect(suspect?: PlayerInstance): void {
    this.suspect = suspect;
  }
}
