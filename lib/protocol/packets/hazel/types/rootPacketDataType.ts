import {
  AlterGameTagPacket,
  EndGamePacket,
  GameDataPacket,
  GetGameListRequestPacket,
  GetGameListResponsePacket,
  HostGameRequestPacket,
  HostGameResponsePacket,
  JoinGameErrorPacket,
  JoinGameRequestPacket,
  JoinGameResponsePacket,
  JoinedGamePacket,
  KickPlayerPacket,
  LateRejectionPacket,
  RedirectPacket,
  RemoveGamePacket,
  RemovePlayerPacket,
  ReselectServerPacket,
  StartGamePacket,
  WaitForHostPacket,
} from "../../root";

export type RootPacketDataType =
  | HostGameRequestPacket
  | HostGameResponsePacket
  | JoinGameRequestPacket
  | JoinGameResponsePacket
  | JoinGameErrorPacket
  | StartGamePacket
  | RemoveGamePacket
  | RemovePlayerPacket
  | LateRejectionPacket
  | GameDataPacket
  | JoinedGamePacket
  | EndGamePacket
  | AlterGameTagPacket
  | KickPlayerPacket
  | WaitForHostPacket
  | RedirectPacket
  | ReselectServerPacket
  | GetGameListRequestPacket
  | GetGameListResponsePacket;
