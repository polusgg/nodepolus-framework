import { PlayerInstance } from "../../player";
import { CancellableEvent } from "../types";
import { Game } from "../../game";
import { VoteResult } from "../../../types";

/**
 * Fired when the voting phase of a meeting has finished.
 */
export class MeetingConcludedEvent extends CancellableEvent {
  private tied = false;
  private exiledClientId = -1;

  /**
   * @param game The game from which this event was fired
   * @param votes The votes from the meeting
   */
  constructor(
    private readonly game: Game,
    private votes: VoteResult[],
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
   * Gets the votes from the meeting.
   */
  getVotes(): VoteResult[] {
    return this.votes;
  }

  /**
   * Sets the votes from the meeting.
   *
   * @param votes The new votes from the meeting
   */
  setVotes(votes: VoteResult[]): void {
    this.votes = votes;
  }

  /**
   * Gets whether or not the current votes will result in a tie.
   *
   * @returns `true` if tied, `false` if not
   */
  isTied(): boolean {
    this.tallyVotes();

    return this.tied;
  }

  /**
   * Gets the player that will be exiled as a result of the current votes.
   *
   * @returns The player that will be exiled, or `undefined` if the meeting will end in a tie or if the current majority of votes are to skip
   */
  getExiledPlayer(): PlayerInstance | undefined {
    this.tallyVotes();

    if (this.tied) {
      return;
    }

    if (this.exiledClientId > -1) {
      return this.game.lobby.findPlayerByClientId(this.exiledClientId);
    }
  }

  /**
   * Does a tally of the current votes to determine if they result in a tie, and
   * which player will be exiled (if any) if the votes do not result in a tie.
   */
  private tallyVotes(): void {
    const counts: Map<number, number> = new Map([[-1, 0]]);
    const entries = [...this.votes];

    for (let i = 0; i < entries.length; i++) {
      const id = entries[i].getVotedFor()?.getId() ?? -1;

      counts.set(id, (counts.get(entries[i].getVotedFor()?.getId() ?? -1) ?? 0) + 1);
    }

    const largestVoteCount = Math.max(...counts.values());
    const allLargestVotes = [...counts.entries()].filter(voteResult => voteResult[1] == largestVoteCount);

    this.tied = allLargestVotes.length > 1;
    this.exiledClientId = allLargestVotes.length == 1 ? allLargestVotes[0][0] : -1;
  }
}
