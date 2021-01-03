import { PlayerInstance } from "../../player";
import { Game } from "../../game";

/**
 * Fired when the post-meeting exile animation has finished.
 */
export class MeetingEndedEvent {
  constructor(
    private readonly game: Game,
    // TODO
    private readonly votes: [],
    private readonly tie: boolean,
    private readonly exiledPlayer?: PlayerInstance,
  ) {}

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
