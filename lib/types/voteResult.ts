import { PlayerInstance } from "../api/player";

export class VoteResult {
  constructor(
    private readonly player: PlayerInstance,
    private votedFor?: PlayerInstance,
    private skipped: boolean = true,
  ) {}

  getPlayer(): PlayerInstance {
    return this.player;
  }

  getVotedFor(): PlayerInstance | undefined {
    return this.skipped ? undefined : this.votedFor;
  }

  setVotedFor(votedFor?: PlayerInstance): void {
    this.votedFor = votedFor;
  }

  isSkipping(): boolean {
    return this.skipped;
  }

  setSkipping(isSkipping: boolean = true): void {
    this.skipped = isSkipping;
  }

  didVote(): boolean {
    return this.skipped || this.votedFor !== undefined;
  }
}
