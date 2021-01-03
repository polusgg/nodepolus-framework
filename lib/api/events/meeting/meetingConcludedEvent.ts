import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when the voting phase of a meeting has finished.
 */
export class MeetingConcludedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    // TODO
    private votes: [],
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getVotes(): [] {
    return this.votes;
  }

  setVotes(votes: []): void {
    this.votes = votes;
  }

  isTie(): boolean {
    // TODO
    return false;
  }

  getExiledPlayer(): PlayerInstance | undefined {
    // TODO
    return undefined;
  }
}
