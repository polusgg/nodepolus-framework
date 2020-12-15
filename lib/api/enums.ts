export enum DeathReason {
  Exile,
  Murder,
  Sabotage,
  // Unknown is used when, for example,
  // the gameData is set to dead for no
  // reason, or the API .kill is used
  Unknown,
}
