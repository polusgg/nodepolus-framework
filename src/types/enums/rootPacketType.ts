export enum RootPacketType {
  HostGame = 0x00,
  JoinGame = 0x01,
  StartGame = 0x02,
  RemoveGame = 0x03,
  RemovePlayer = 0x04,
  GameData = 0x05,
  GameDataTo = 0x06,
  JoinedGame = 0x07,
  EndGame = 0x08,
  GetGameListV1 = 0x09,
  AlterGameTag = 0x0a,
  KickPlayer = 0x0b,
  WaitForHost = 0x0c,
  Redirect = 0x0d,
  ReselectServer = 0x0e,
  GetGameList = 0x10,
}