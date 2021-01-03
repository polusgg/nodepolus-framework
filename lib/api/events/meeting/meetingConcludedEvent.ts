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

  constructor(
    private readonly game: Game,
    private votes: VoteResult[],
  ) {
    super();
  }

  getGame(): Game {
    return this.game;
  }

  getVotes(): VoteResult[] {
    return this.votes;
  }

  setVotes(votes: VoteResult[]): void {
    this.votes = votes;
  }

  isTied(): boolean {
    this.tallyVotes();

    return this.tied;
  }

  getExiledPlayer(): PlayerInstance | undefined {
    this.tallyVotes();

    if (this.tied) {
      return;
    }

    if (this.exiledClientId > -1) {
      return this.game.lobby.findPlayerByClientId(this.exiledClientId);
    }
  }

  private tallyVotes(): void {
    const counts: Map<number, number> = new Map([[-1, 0]]);
    const entries = [...this.votes];

    for (let i = 0; i < entries.length; i++) {
      const id = entries[i][1].getVotedFor()?.getId() ?? -1;

      counts.set(id, (counts.get(entries[i][1].getVotedFor()?.getId() ?? -1) ?? 0) + 1);
    }

    const largestVoteCount = Math.max(...counts.values());
    const allLargestVotes = [...counts.entries()].filter(voteResult => voteResult[1] == largestVoteCount);

    this.tied = allLargestVotes.length > 1;
    this.exiledClientId = allLargestVotes.length == 1 ? allLargestVotes[0][0] : -1;
  }
}
