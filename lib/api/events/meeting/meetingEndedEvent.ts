import { PlayerInstance } from "../../player";
import { Game } from "../../game";
import { VoteResult } from "../../../types";

/**
 * Fired when the post-meeting exile animation has finished.
 */
export class MeetingEndedEvent {
  constructor(
    private readonly game: Game,
    private readonly votes: VoteResult[],
    private readonly tie: boolean,
    private readonly exiledPlayer?: PlayerInstance,
  ) {}

  getGame(): Game {
    return this.game;
  }

  getVotes(): VoteResult[] {
    return this.votes;
  }

  isTie(): boolean {
    return this.tie;
  }

  getExiledPlayer(): PlayerInstance | undefined {
    return this.exiledPlayer;
  }
}
