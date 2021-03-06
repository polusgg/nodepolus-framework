import { PlayerInstance } from "../../player";
import { VoteResult } from "../../../types";
import { Game } from "../../game";

/**
 * Fired when the post-meeting exile animation has finished.
 */
export class MeetingEndedEvent {
  /**
   * @param game - The game from which this event was fired
   * @param votes - The final votes from the meeting
   * @param tie - `true` if the voting phase of the meeting ended in a tie, `false` if not
   * @param exiledPlayer - The player that was exiled as a result of the final votes
   */
  constructor(
    protected readonly game: Game,
    protected readonly votes: VoteResult[],
    protected readonly tie: boolean,
    protected readonly exiledPlayer?: PlayerInstance,
  ) {}

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the final votes from the meeting.
   */
  getVotes(): VoteResult[] {
    return this.votes;
  }

  /**
   * Gets whether or not the voting phase of the meeting ended in a tie.
   *
   * @returns `true` if tied, `false` if not
   */
  isTie(): boolean {
    return this.tie;
  }

  /**
   * Gets the player that was exiled as a result of the final votes.
   *
   * @returns The player that was exiled, or `undefined` if the meeting ended in a tie or if the majority of votes were to skip
   */
  getExiledPlayer(): PlayerInstance | undefined {
    return this.exiledPlayer;
  }
}
