export enum VoteStateMask {
  DidReport = 0x20,
  DidVote = 0x40,
  IsDead = 0x80,
  VotedFor = 0x0f,
}
