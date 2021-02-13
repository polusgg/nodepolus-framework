import { Immutable, VoteResult } from "../../../types";
import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";

/**
 * Fired when a meeting window has been closed.
 */
export class MeetingClosedEvent extends CancellableEvent {
  /**
   * @param game - The game from which this event was fired
   * @param votes - The final votes from the meeting
   * @param tie - `true` if the voting phase of the meeting ended in a tie, `false` if not
   * @param exiledPlayer - The player that was exiled as a result of the final votes
   */
  constructor(
    private readonly game: Game,
    private readonly votes: Immutable<VoteResult>[],
    private readonly tie: boolean,
    private readonly exiledPlayer?: PlayerInstance,
  ) {
    super();
  }

  /**
   * Gets the game from which this event was fired.
   */
  getGame(): Game {
    return this.game;
  }

  /**
   * Gets the final votes from the meeting.
   */
  getVotes(): Immutable<VoteResult>[] {
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
