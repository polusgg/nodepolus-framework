export enum GameOverReason {
  CrewmatesByVote = 0,
  CrewmatesByTask = 1,
  ImpostorsByVote = 2,
  ImpostorsByKill = 3,
  ImpostorsBySabotage = 4,
  CrewmatesBySabotage = -1,
  ImpostorDisconnect = 5,
  CrewmateDisconnect = 6,
}
