import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a meeting window has been closed.
 */
export class MeetingClosedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    // TODO
    private readonly votes: [],
    private readonly tie: boolean,
    private readonly exiledPlayer?: PlayerInstance,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getVotes(): [] {
    return this.votes;
  }

  isTie(): boolean {
    return this.tie;
  }

  getExiledPlayer(): PlayerInstance | undefined {
    return this.exiledPlayer;
  }
}
