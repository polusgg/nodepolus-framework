import { BaseEntityShipStatus } from "../../protocol/entities/baseShipStatus/baseEntityShipStatus";
import { BaseInnerNetEntity, BaseInnerNetObject } from "../../protocol/entities/types";
import { GameState, AlterGameTag, Level, PlayerColor } from "../../types/enums";
import { EntityLobbyBehaviour } from "../../protocol/entities/lobbyBehaviour";
import { EntityMeetingHud } from "../../protocol/entities/meetingHud";
import { PlayerData } from "../../protocol/entities/gameData/types";
import { EntityGameData } from "../../protocol/entities/gameData";
import { LobbyListing } from "../../protocol/packets/root/types";
import { EntityPlayer } from "../../protocol/entities/player";
import { BaseRpcPacket } from "../../protocol/packets/rpc";
import { GameOptionsData, Immutable } from "../../types";
import { Connection } from "../../protocol/connection";
import { LobbySettings } from "./lobbySettings";
import { PlayerInstance } from "../player";
import { TextComponent } from "../text";
import { HostInstance } from "../host";
import { Logger } from "../../logger";
import { Server } from "../../server";
import { Game } from "../game";

/**
 * An interface describing the public API of lobbies hosted on a server.
 */
export interface LobbyInstance {
  /**
   * Gets the lobby's named logger.
   */
  getLogger(): Logger;

  /**
   * Gets the server instance.
   */
  getServer(): Server;

  /**
   * Gets the IP address to which the server hosting the lobby is bound.
   */
  getAddress(): string;

  /**
   * Gets the port on which the server hosting the lobby listens for packets.
   */
  getPort(): number;

  /**
   * Gets the default time, in seconds, until the game starts after a host clicks
   * the Play button.
   */
  getStartTimerDuration(): number;

  /**
   * Gets the lobby code.
   */
  getCode(): string;

  /**
   * Gets the name of the lobby to be displayed in the public game list.
   */
  getHostName(): string;

  /**
   * Gets whether or not the lobby is public.
   *
   * @returns `true` if the lobby is public, `false` if not
   */
  isPublic(): boolean;

  /**
   * Gets whether or not the lobby is full.
   *
   * @returns `true` if the lobby is full, `false` if not
   */
  isFull(): boolean;

  /**
   * Gets the data for the lobby to be displayed in the public game list.
   */
  getLobbyListing(): LobbyListing;

  /**
   * Gets the active game instance for the lobby.
   *
   * @returns The active game, or `undefined` if the lobby is not in-game
   */
  getGame(): Game | undefined;

  /**
   * Gets the time at which the lobby was created.
   */
  getCreationTime(): number;

  /**
   * Gets the age of the lobby in seconds.
   */
  getAge(): number;

  /**
   * Disconnects all connections from the lobby and removes the lobby from the
   * server.
   */
  close(): void;

  /**
   * Gets whether or not the lobby has metadata for the given key.
   *
   * @param key The metadata key
   */
  hasMeta(key: string): boolean;

  /**
   * Gets all of the metadata associated with the lobby.
   */
  getMeta(): Map<string, unknown>;

  /**
   * Gets the metadata for the given key.
   *
   * @param key The key whose associated metadata will be returned
   * @returns The metadata, or `undefined` if no metadata is associated with `key`
   */
  getMeta(key: string): unknown;

  /**
   * Gets the metadata for the given key, or all of the metadata associated
   * with the lobby.
   *
   * @param key The key whose associated data will be returned, or `undefined` to return all metadata
   * @returns The metadata, or `undefined` if no metadata is associated with `key`
   */
  getMeta(key?: string): Map<string, unknown> | unknown;

  /**
   * Sets the metadata for the given key.
   *
   * @param key The key whose metadata will be set
   * @param value The metadata to be set
   */
  setMeta(key: string, value: unknown): void;

  /**
   * Deletes the metadata for the given key.
   *
   * @param key The key whose metatada will be deleted
   */
  deleteMeta(key: string): void;

  /**
   * Deletes all metadata associated with the lobby.
   */
  clearMeta(): void;

  /**
   * Gets the host controller for the lobby.
   */
  getHostInstance(): HostInstance;

  /**
   * Gets all of the connections in the lobby.
   */
  getConnections(): Connection[];

  /**
   * Adds the given connection to the lobby.
   *
   * @param connection The connection to be added to the lobby
   */
  addConnection(connection: Connection): void;

  /**
   * Removes the given connection from the lobby.
   *
   * @param connection The connection to be removed from the lobby
   */
  removeConnection(connection: Connection): void;

  /**
   * Gets all of the spawned players in the lobby.
   */
  getPlayers(): PlayerInstance[];

  /**
   * Adds the given player to the lobby.
   *
   * @param player The player to be added to the lobby
   */
  addPlayer(player: PlayerInstance): void;

  /**
   * Deletes all references to spawned players in the lobby.
   */
  clearPlayers(): void;

  /**
   * Removes the given player from the lobby.
   *
   * @param player The player to be removed from the lobby
   */
  removePlayer(player: PlayerInstance): void;

  /**
   * Gets the first InnerNetObject whose ID matches the given ID.
   *
   * @param netId The ID of the InnerNetObject
   * @returns The InnerNetObject, or `undefined` if no InnerNetObject in the lobby has the ID `netId`
   */
  findInnerNetObject(netId: number): BaseInnerNetObject | undefined;

  /**
   * Gets the first player with the given client ID.
   *
   * @param clientId The ID of the connection
   * @returns The player, or `undefined` if no players in the lobby belong to a connection with the ID `clientId`
   */
  findPlayerByClientId(clientId: number): PlayerInstance | undefined;

  /**
   * Gets the first player with the given player ID.
   *
   * @param playerId The ID of the player
   * @returns The player, or `undefined` if no players in the lobby have the ID `playerId`
   */
  findPlayerByPlayerId(playerId: number): PlayerInstance | undefined;

  /**
   * Gets the first player with the given net ID.
   *
   * @param netId The ID of the InnerNetObject
   * @returns The player, or `undefined` if no players in the lobby have an InnerNetObject with the ID `netId`
   */
  findPlayerByNetId(netId: number): PlayerInstance | undefined;

  /**
   * Gets the first player belonging to the given connection.
   *
   * @param connection The connection to which the player belongs
   * @returns The player, or `undefined` if no players in the lobby belong to `connection`
   */
  findPlayerByConnection(connection: Connection): PlayerInstance | undefined;

  /**
   * Gets the first player that owns the given entity.
   *
   * @param entity The entity that belongs to the player
   * @returns The player, or `undefined` if no players in the lobby own `entity`
   */
  findPlayerByEntity(entity: EntityPlayer): PlayerInstance | undefined;

  /**
   * Gets the index of the first player belonging to the given connection.
   *
   * @param connection The connection to which the player belongs
   */
  findPlayerIndexByConnection(connection: Connection): number;

  /**
   * Gets the connection with the given client ID.
   *
   * @param clientId The ID of the connection
   * @returns The connection, or `undefined` if no connections in the lobby have the ID `clientId`
   */
  findConnection(id: number): Connection | undefined;

  /**
   * Gets the GameData instance for the lobby.
   */
  getGameData(): EntityGameData | undefined;

  /**
   * Sets the GameData instance for the lobby.
   *
   * @param gameData The lobby's new GameData instance
   */
  setGameData(gameData: EntityGameData): void;

  /**
   * Deletes the GameData instance for the lobby.
   */
  deleteGameData(): void;

  /**
   * Gets the LobbyBehaviour instance for the lobby.
   */
  getLobbyBehaviour(): EntityLobbyBehaviour | undefined;

  /**
   * Sets the LobbyBehaviour instance for the lobby.
   *
   * @param lobbyBehaviour The lobby's new LobbyBehaviour instance
   */
  setLobbyBehaviour(lobbyBehaviour: EntityLobbyBehaviour): void;

  /**
   * Deletes the LobbyBehaviour instance for the lobby.
   */
  deleteLobbyBehaviour(): void;

  /**
   * Gets the ShipStatus instance for the lobby.
   */
  getShipStatus(): BaseEntityShipStatus | undefined;

  /**
   * Sets the ShipStatus instance for the lobby.
   *
   * @param shipStatus The lobby's new ShipStatus instance
   */
  setShipStatus(shipStatus: BaseEntityShipStatus): void;

  /**
   * Deletes the ShipStatus instance for the lobby.
   */
  deleteShipStatus(): void;

  /**
   * Gets the MeetingHud instance for the lobby.
   */
  getMeetingHud(): EntityMeetingHud | undefined;

  /**
   * Sets the MeetingHud instance for the lobby.
   *
   * @param meetingHud The lobby's new MeetingHud instance
   */
  setMeetingHud(meetingHud: EntityMeetingHud): void;

  /**
   * Deletes the MeetingHud instance for the lobby.
   */
  deleteMeetingHud(): void;

  /**
   * Gets the settings for the lobby.
   */
  getSettings(): LobbySettings;

  /**
   * Gets the raw settings for the lobby.
   */
  getOptions(): Immutable<GameOptionsData>;

  /**
   * Gets the current level on which the lobby is playing.
   */
  getLevel(): Level;

  /**
   * Gets all game tags for the lobby.
   */
  getGameTags(): Map<AlterGameTag, number>;

  /**
   * Gets the given game tag for the lobby.
   *
   * @param gameTag The game tag whose value will be returned
   */
  getGameTag(gameTag: AlterGameTag): number | undefined;

  /**
   * Sets the given game tag for the lobby.
   *
   * @param gameTag The game tag whose value will be set
   * @param value The value to be set
   */
  setGameTag(gameTag: AlterGameTag, value: number): void;

  /**
   * Gets the game state of the lobby.
   */
  getGameState(): GameState;

  /**
   * Sets the game state of the lobby.
   *
   * @param gameState The lobby's new game state
   */
  setGameState(gameState: GameState): void;

  /**
   * Sends the given RPC packet to the given connections.
   *
   * @param from The InnerNetObject from which the packet will be sent
   * @param packet The packet to be sent
   * @param sendTo The connections to which the packet will be sent
   */
  sendRpcPacket(from: BaseInnerNetObject, packet: BaseRpcPacket, sendTo?: Connection[]): void;

  /**
   * Spawns an entity in the lobby.
   *
   * @param entity The lobby to nbe spawned
   */
  spawn(entity: BaseInnerNetEntity): void;

  /**
   * Spawns a player in the lobby.
   *
   * @param player The player to be spawned
   * @param playerData The data for the spawned player
   * @returns The PlayerInstance for the spawned player
   */
  spawnPlayer(player: EntityPlayer, playerData: PlayerData): PlayerInstance;

  /**
   * Despawns the given InnerNetObject.
   *
   * @param innerNetObject The InnerNetObject to be despawned
   */
  despawn(innerNetObject: BaseInnerNetObject): void;

  /**
   * Gets all players that are acting hosts of the lobby.
   */
  getActingHosts(): Connection[];

  /**
   * Sends a server message in the lobby chat window.
   *
   * @param name The chat message avatar's name
   * @param color The chat message avatar's color
   * @param message The message to be sent
   * @param onLeft `true` to display the message on the left-hand side, `false` to display it on the right-hand side
   */
  sendChat(name: string, color: PlayerColor, message: string | TextComponent, onLeft: boolean): void;
}
