import { BaseEntityShipStatus } from "../../protocol/entities/baseShipStatus/baseEntityShipStatus";
import { EntityLobbyBehaviour } from "../../protocol/entities/lobbyBehaviour";
import { EntityMeetingHud } from "../../protocol/entities/meetingHud";
import { BaseInnerNetObject } from "../../protocol/entities/types";
import { EntityGameData } from "../../protocol/entities/gameData";
import { BaseRPCPacket } from "../../protocol/packets/rpc";
import { Connection } from "../../protocol/connection";
import { LobbySettings } from "./lobbySettings";
import { GameState, AlterGameTag } from "../../types/enums";
import { InternalPlayer } from "../../player";
import { HostInstance } from "../host";

export interface LobbyInstance {
  getCreationTime(): number;

  getAge(): number;

  getHostInstance(): HostInstance;

  getConnections(): Connection[];

  addConnection(connection: Connection): void;

  findConnectionByPlayer(player: InternalPlayer): Connection | undefined;

  removeConnection(connection: Connection): void;

  getPlayers(): InternalPlayer[];

  addPlayer(player: InternalPlayer): void;

  findPlayerByClientId(clientId: number): InternalPlayer | undefined;

  findPlayerByPlayerId(playerId: number): InternalPlayer | undefined;

  findPlayerByNetId(netId: number): InternalPlayer | undefined;

  clearPlayers(): void;

  removePlayer(player: InternalPlayer): void;

  getGameData(): EntityGameData | undefined;

  setGameData(gameData: EntityGameData): void;

  deleteGameData(): void;

  getLobbyBehaviour(): EntityLobbyBehaviour | undefined;

  setLobbyBehaviour(lobbyBehaviour: EntityLobbyBehaviour): void;

  deleteLobbyBehaviour(): void;

  getShipStatus(): BaseEntityShipStatus | undefined;

  setShipStatus(shipStatus: BaseEntityShipStatus): void;

  deleteShipStatus(): void;

  getMeetingHud(): EntityMeetingHud | undefined;

  setMeetingHud(meetingHud: EntityMeetingHud): void;

  deleteMeetingHud(): void;

  getSettings(): LobbySettings;

  getGameTags(): Map<AlterGameTag, number>;

  getGameTag(gameTag: AlterGameTag): number | undefined;

  setGameTag(gameTag: AlterGameTag, value: number): void;

  getGameState(): GameState;

  setGameState(gameState: GameState): void;

  getAddress(): string;

  getPort(): number;

  getCode(): string;

  setCode(code: string): void;

  sendRPCPacket(from: BaseInnerNetObject, packet: BaseRPCPacket, sendTo?: Connection[]): void;
}
