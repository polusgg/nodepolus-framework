export enum StringLocation {
  // e.g. Code\nXADFJK
  GameCode,

  // e.g. 8 / 10
  GamePlayerCount,

  // String of "__unset" is used to revert to standard task text
  TaskText,

  // String of "__unset" is used to revert to standard room name
  RoomTracker,

  // NOTE: setting this prevents the ping from updating until it's set to the string "__unset" at which point it will go back to default behaviour. Strings can also be sent with %s, like "Your ping is: %s" which would update live w/ your ping
  PingTracker,

  // e.g. "TOTAL TASKS COMPLETED"
  TaskCompletion,

  //TODO: Potentially unused with the addition of custom gameoptions api
  GameOptions,
}
