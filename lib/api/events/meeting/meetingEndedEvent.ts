import { PlayerInstance } from "../../player";
import { Game } from "../../game";
import { VoteResult } from "../../../types";

/**
 * Fired when the post-meeting exile animation has finished.
 */
export class MeetingEndedEvent {
  /**
   * @param game The game from which this event was fired
   * @param votes The final votes from the meeting
   * @param tie Whether or not the voting phase of the meeting ended in a tie
   * @param exiledPlayer The player that was exiled as a result of the final votes
   */
  constructor(
    private readonly game: Game,
    private readonly votes: VoteResult[],
    private readonly tie: boolean,
    private readonly exiledPlayer?: PlayerInstance,
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
