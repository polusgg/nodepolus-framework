import { Immutable, VoteResult } from "../../../types";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a meeting window has been closed.
 */
export class MeetingClosedEvent extends CancellableEvent {
  constructor(
    private readonly game: Game,
    private readonly votes: Immutable<VoteResult>[],
    private readonly tie: boolean,
    private readonly exiledPlayer?: PlayerInstance,
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getVotes(): Immutable<VoteResult>[] {
    return this.votes;
  }

  isTie(): boolean {
    return this.tie;
  }

  getExiledPlayer(): PlayerInstance | undefined {
    return this.exiledPlayer;
  }
}
