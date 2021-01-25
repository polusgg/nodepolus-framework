import { EntityPlayer, InnerCustomNetworkTransform, InnerPlayerControl, InnerPlayerPhysics } from "../protocol/entities/player";
import { BaseGameDataPacket, DataPacket, DespawnPacket, RPCPacket, SceneChangePacket } from "../protocol/packets/gameData";
import { BaseEntityShipStatus } from "../protocol/entities/baseShipStatus/baseEntityShipStatus";
import { GameDataPacketType, RootPacketType } from "../protocol/packets/types/enums";
import { BaseInnerNetEntity, BaseInnerNetObject } from "../protocol/entities/types";
import { DisconnectReason, GameOptionsData, Immutable, Vector2 } from "../types";
import { BaseRPCPacket, UpdateGameDataPacket } from "../protocol/packets/rpc";
import { EntityLobbyBehaviour } from "../protocol/entities/lobbyBehaviour";
import { InnerNetObjectType } from "../protocol/entities/types/enums";
import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { ServerLobbyJoinRefusedEvent } from "../api/events/server";
import { PlayerData } from "../protocol/entities/gameData/types";
import { EntityGameData } from "../protocol/entities/gameData";
import { LobbyPrivacyUpdatedEvent } from "../api/events/lobby";
import { LobbyListing } from "../protocol/packets/root/types";
import { LobbyInstance, LobbySettings } from "../api/lobby";
import { PlayerJoinedEvent } from "../api/events/player";
import { Connection } from "../protocol/connection";
import { notUndefined } from "../util/functions";
import { PlayerInstance } from "../api/player";
import { LobbyCode } from "../util/lobbyCode";
import { TextComponent } from "../api/text";
import { HostInstance } from "../api/host";
import { InternalPlayer } from "../player";
import { RPCHandler } from "./rpcHandler";
import { InternalHost } from "../host";
import { Game } from "../api/game";
import { Logger } from "../logger";
import { Server } from "../server";
import {
  AlterGameTagPacket,
  BaseRootPacket,
  EndGamePacket,
  GameDataPacket,
  JoinGameErrorPacket,
  JoinGameResponsePacket,
  JoinedGamePacket,
  KickPlayerPacket,
  LateRejectionPacket,
  RemoveGamePacket,
  RemovePlayerPacket,
  StartGamePacket,
  WaitForHostPacket,
} from "../protocol/packets/root";
import {
  AlterGameTag,
  DisconnectReasonType,
  FakeClientId,
  GameOverReason,
  GameState,
  Level,
  LimboState,
  PlayerColor,
  PlayerHat,
  PlayerPet,
  PlayerSkin,
  SpawnType,
} from "../types/enums";

export class InternalLobby implements LobbyInstance {
  public ignoredNetIds: number[] = [];

  private readonly createdAt: number = Date.now();
  private readonly hostInstance: HostInstance = new InternalHost(this);
  private readonly rpcHandler: RPCHandler = new RPCHandler(this);
  private readonly spawningPlayers: Set<Connection> = new Set();
  private readonly connections: Connection[] = [];
  private readonly settings: LobbySettings = new LobbySettings(this);
  private readonly gameTags: Map<AlterGameTag, number> = new Map([[AlterGameTag.ChangePrivacy, 0]]);
  private readonly metadata: Map<string, unknown> = new Map();

  private game?: Game;
  private players: InternalPlayer[] = [];
  private gameState = GameState.NotStarted;
  private gameData?: EntityGameData;
  private lobbyBehaviour?: EntityLobbyBehaviour;
  private shipStatus?: BaseEntityShipStatus;
  private meetingHud?: EntityMeetingHud;

  // TODO: Add check to destroy the room when created by a player if nobody joins in a certain amount of time
  constructor(
    private readonly server: Server,
    private readonly address: string,
    private readonly port: number,
    private options: GameOptionsData = new GameOptionsData(),
    private readonly code: string = LobbyCode.generate(),
  ) {}

  getLogger(): Logger {
    return this.server.getLogger(`Lobby ${this.code}`);
  }

  getServer(): Server {
    return this.server;
  }

  getAddress(): string {
    return this.address;
  }

  getPort(): number {
    return this.port;
  }

  getCode(): string {
    return this.code;
  }

  getHostName(): string {
    return this.getActingHosts()[0]?.getName() ?? this.connections[0].getName()!;
  }

  isPublic(): boolean {
    return !!(this.getGameTag(AlterGameTag.ChangePrivacy) ?? 0);
  }

  isFull(): boolean {
    return this.connections.length >= this.options.maxPlayers;
  }

  getLobbyListing(): LobbyListing {
    return new LobbyListing(
      this.address,
      this.port,
      this.code,
      this.getHostName().substring(0, 12),
      this.connections.length,
      this.getAge(),
      this.options.levels[0],
      this.options.impostorCount,
      this.options.maxPlayers,
    );
  }

  getGame(): Game | undefined {
    return this.game;
  }

  /**
   * @internal
   */
  setGame(game?: Game): void {
    this.game = game;
  }

  getCreationTime(): number {
    return this.createdAt;
  }

  getAge(): number {
    return (new Date().getTime() - this.createdAt) / 1000;
  }

  hasMeta(key: string): boolean {
    return this.metadata.has(key);
  }

  getMeta(): Map<string, unknown>;
  getMeta(key: string): unknown;
  getMeta(key?: string): Map<string, unknown> | unknown {
    return key === undefined ? this.metadata : this.metadata.get(key);
  }

  setMeta(key: string, value: unknown): void {
    this.metadata.set(key, value);
  }

  deleteMeta(key: string): void {
    this.metadata.delete(key);
  }

  clearMeta(): void {
    this.metadata.clear();
  }

  getHostInstance(): HostInstance {
    return this.hostInstance;
  }

  getConnections(): Connection[] {
    return this.connections;
  }

  addConnection(connection: Connection): void {
    this.connections.push(connection);
  }

  removeConnection(connection: Connection): void {
    this.connections.splice(this.connections.indexOf(connection), 1);
  }

  getPlayers(): InternalPlayer[] {
    return this.players;
  }

  addPlayer(player: InternalPlayer): void {
    this.players.push(player);
  }

  findPlayerByClientId(clientId: number): InternalPlayer | undefined {
    return this.players.find(player => player.entity.owner == clientId);
  }

  findPlayerByPlayerId(playerId: number): InternalPlayer | undefined {
    return this.players.find(player => player.getId() == playerId);
  }

  findPlayerByNetId(netId: number): InternalPlayer | undefined {
    return this.players.find(player => player.entity.innerNetObjects.some(object => object.netId == netId));
  }

  clearPlayers(): void {
    this.players = [];
  }

  removePlayer(player: InternalPlayer): void {
    this.players.splice(this.players.indexOf(player), 1);
  }

  getGameData(): EntityGameData | undefined {
    return this.gameData;
  }

  setGameData(gameData: EntityGameData): void {
    this.gameData = gameData;
  }

  deleteGameData(): void {
    delete this.gameData;
  }

  getLobbyBehaviour(): EntityLobbyBehaviour | undefined {
    return this.lobbyBehaviour;
  }

  setLobbyBehaviour(lobbyBehaviour: EntityLobbyBehaviour): void {
    this.lobbyBehaviour = lobbyBehaviour;
  }

  deleteLobbyBehaviour(): void {
    delete this.lobbyBehaviour;
  }

  getShipStatus(): BaseEntityShipStatus | undefined {
    return this.shipStatus;
  }

  setShipStatus(shipStatus: BaseEntityShipStatus): void {
    this.shipStatus = shipStatus;
  }

  deleteShipStatus(): void {
    delete this.shipStatus;
  }

  getMeetingHud(): EntityMeetingHud | undefined {
    return this.meetingHud;
  }

  setMeetingHud(meetingHud: EntityMeetingHud): void {
    this.meetingHud = meetingHud;
  }

  deleteMeetingHud(): void {
    delete this.meetingHud;
  }

  getSettings(): LobbySettings {
    return this.settings;
  }

  getOptions(): Immutable<GameOptionsData> {
    return this.options;
  }

  /**
   * @internal
   */
  getMutableOptions(): GameOptionsData {
    return this.options;
  }

  /**
   * @internal
   */
  setOptions(options: GameOptionsData): void {
    this.options = options;
  }

  getLevel(): Level {
    return this.options.levels[0];
  }

  getGameTags(): Map<AlterGameTag, number> {
    return this.gameTags;
  }

  getGameTag(gameTag: AlterGameTag): number | undefined {
    return this.gameTags.get(gameTag);
  }

  async setGameTag(gameTag: AlterGameTag, value: number): Promise<void> {
    switch (gameTag) {
      case AlterGameTag.ChangePrivacy: {
        const event = new LobbyPrivacyUpdatedEvent(this, !!value);

        await this.server.emit("lobby.privacy.updated", event);

        if (event.isCancelled()) {
          return;
        }

        value = event.isPublic() ? 1 : 0;
        break;
      }
    }

    this.gameTags.set(gameTag, value);
    this.handleAlterGameTag(gameTag, value);
  }

  getGameState(): GameState {
    return this.gameState;
  }

  setGameState(gameState: GameState): void {
    this.gameState = gameState;
  }

  sendMessage(message: TextComponent | string): void {
    if (this.gameData === undefined) {
      throw new Error("sendMessage called without a GameData instance");
    }

    const playerId = 127;
    const playerData = new PlayerData(
      playerId,
      `[FFFFFFFF]${message.toString()}[FFFFFF00]`,
      PlayerColor.Red,
      PlayerHat.None,
      PlayerPet.None,
      PlayerSkin.None,
      false,
      false,
      false,
      [],
    );

    const entity = new EntityPlayer(
      this,
      FakeClientId.Message,
      this.hostInstance.getNextNetId(),
      playerId,
      this.hostInstance.getNextNetId(),
      this.hostInstance.getNextNetId(),
      5,
      new Vector2(39, 39),
      new Vector2(0, 0),
    );

    this.sendRootGamePacket(new JoinGameResponsePacket(this.code, FakeClientId.Message, this.hostInstance.getId()));
    this.sendRootGamePacket(new GameDataPacket([entity.serializeSpawn()], this.code));

    this.connections.forEach(con => {
      con.flush();
    });

    this.gameData.gameData.updateGameData([playerData], this.connections);
    this.sendRootGamePacket(new RemovePlayerPacket(this.code, FakeClientId.Message, this.hostInstance.getId()));
  }

  sendRPCPacket(from: BaseInnerNetObject, packet: BaseRPCPacket, sendTo?: Connection[]): void {
    this.sendRootGamePacket(new GameDataPacket([new RPCPacket(from.netId, packet)], this.code), sendTo);
  }

  spawn(entity: BaseInnerNetEntity): void {
    const type = entity.type;

    switch (type) {
      case SpawnType.SkeldShipStatus:
      case SpawnType.SkeldAprilShipStatus:
      case SpawnType.MiraShipStatus:
      case SpawnType.PolusShipStatus:
      case SpawnType.AirshipStatus:
        this.shipStatus = entity as BaseEntityShipStatus;
        break;
      case SpawnType.GameData:
        this.gameData = entity as EntityGameData;
        break;
      case SpawnType.MeetingHud:
        this.meetingHud = entity as EntityMeetingHud;
        break;
      case SpawnType.LobbyBehaviour:
        this.lobbyBehaviour = entity as EntityLobbyBehaviour;
        break;
      case SpawnType.PlayerControl:
        this.getLogger().warn("Use LobbyInstance#spawnPlayer() to spawn a player");

        return;
      default:
        throw new Error(`Attempted to spawn an unsupported SpawnType: ${type as SpawnType} (${SpawnType[type]})`);
    }

    this.sendRootGamePacket(new GameDataPacket([entity.serializeSpawn()], this.code), this.getConnections());
  }

  spawnPlayer(player: EntityPlayer, playerData: PlayerData): PlayerInstance {
    if (player.playerControl.playerId != playerData.id) {
      throw new Error(`Attempted to spawn a player with mismatched player IDs: PlayerControl(${player.playerControl.playerId}) != PlayerData(${playerData.id})`);
    }

    const clientIdInUse = !!this.findPlayerByClientId(player.owner);
    const playerInstance = new InternalPlayer(this, player, this.findConnection(player.owner));

    this.addPlayer(playerInstance);

    if (!clientIdInUse) {
      this.sendRootGamePacket(new JoinGameResponsePacket(this.code, player.owner, this.hostInstance.getId()));
    }

    this.sendRootGamePacket(new GameDataPacket([player.serializeSpawn()], this.code), this.getConnections());

    if (this.gameData) {
      this.gameData.gameData.players.push(playerData);
      this.sendRPCPacket(this.gameData.gameData, new UpdateGameDataPacket([playerData]));
    }

    return playerInstance;
  }

  despawn(innerNetObject: BaseInnerNetObject): void {
    if (innerNetObject.parent.lobby.getCode() != this.code) {
      throw new Error(`Attempted to despawn an InnerNetObject from a lobby other than its own`);
    }

    this.sendRootGamePacket(new GameDataPacket([new DespawnPacket(innerNetObject.netId)], this.code));
  }

  getActingHosts(): Connection[] {
    return this.connections.filter(con => con.isActingHost);
  }

  setActingHost(connection: Connection, sendImmediately: boolean = true): void {
    connection.isActingHost = true;

    this.sendSetHost(connection, sendImmediately);
  }

  removeActingHost(connection: Connection, sendImmediately: boolean = true): void {
    connection.isActingHost = false;

    this.sendRemoveHost(connection, sendImmediately);
  }

  /**
   * @internal
   */
  isSpawningPlayers(): boolean {
    return this.spawningPlayers.size > 0;
  }

  /**
   * @internal
   */
  async finishedSpawningPlayer(connection: Connection): Promise<void> {
    this.spawningPlayers.delete(connection);

    const player = this.findPlayerByConnection(connection);

    if (player) {
      await this.getServer().emit("player.joined", new PlayerJoinedEvent(this, player, !connection.firstJoin));

      connection.firstJoin = false;
    }
  }

  /**
   * @internal
   */
  startedSpawningPlayer(connection: Connection): void {
    this.spawningPlayers.add(connection);
  }

  /**
   * @internal
   */
  removeActingHosts(sendImmediately: boolean = true): void {
    const actingHosts = this.getActingHosts();

    for (let i = 0; i < actingHosts.length; i++) {
      if (actingHosts[i].limboState == LimboState.NotLimbo) {
        this.sendRemoveHost(actingHosts[i], sendImmediately);
      }
    }
  }

  /**
   * @internal
   */
  reapplyActingHosts(sendImmediately: boolean = true): void {
    const actingHosts = this.getActingHosts();

    for (let i = 0; i < actingHosts.length; i++) {
      if (actingHosts[i].limboState == LimboState.NotLimbo) {
        this.sendSetHost(actingHosts[i], sendImmediately);
      }
    }
  }

  /**
   * @internal
   */
  sendSetHost(connection: Connection, sendImmediately: boolean = true): void {
    if (sendImmediately) {
      connection.sendReliable([new JoinGameResponsePacket(this.code, connection.id, connection.id)]);
    } else {
      connection.write(new JoinGameResponsePacket(this.code, connection.id, connection.id));
    }
  }

  /**
   * @internal
   */
  sendRemoveHost(connection: Connection, sendImmediately: boolean = true): void {
    if (sendImmediately) {
      connection.sendReliable([new JoinGameResponsePacket(this.code, connection.id, this.hostInstance.getId())]);
    } else {
      connection.write(new JoinGameResponsePacket(this.code, connection.id, this.hostInstance.getId()));
    }
  }

  /**
   * @internal
   */
  findInnerNetObject(netId: number): BaseInnerNetObject | undefined {
    switch (netId) {
      case this.lobbyBehaviour?.lobbyBehaviour.netId:
        return this.lobbyBehaviour!.lobbyBehaviour;
      case this.gameData?.gameData.netId:
        return this.gameData!.gameData;
      case this.gameData?.voteBanSystem.netId:
        return this.gameData!.voteBanSystem;
      case this.shipStatus?.getShipStatus().netId:
        return this.shipStatus!.getShipStatus();
      case this.meetingHud?.meetingHud.netId:
        return this.meetingHud!.meetingHud;
    }

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];

      for (let j = 0; j < player.entity.innerNetObjects.length; j++) {
        const object = player.entity.innerNetObjects[j];

        if (notUndefined(object) && object.netId == netId) {
          return object;
        }
      }
    }

    throw new Error(`InnerNetObject #${netId} not found`);
  }

  /**
   * @internal
   */
  findPlayerByConnection(connection: Connection): InternalPlayer | undefined {
    return this.players.find(player => player.entity.owner == connection.id);
  }

  /**
   * @internal
   */
  findPlayerByEntity(entity: EntityPlayer): InternalPlayer | undefined {
    return this.players.find(player => player.entity.owner == entity.owner);
  }

  /**
   * @internal
   */
  findPlayerByInnerNetObject(netObject: InnerPlayerControl | InnerPlayerPhysics | InnerCustomNetworkTransform): InternalPlayer | undefined {
    return this.players.find(player => player.entity == netObject.parent);
  }

  /**
   * @internal
   */
  findPlayerIndexByConnection(connection: Connection): number {
    return this.players.findIndex(player => player.entity.owner == connection.id);
  }

  /**
   * @internal
   */
  findConnection(id: number): Connection | undefined {
    return this.connections.find(con => con.id == id);
  }

  /**
   * @internal
   */
  async sendRootGamePacket(packet: BaseRootPacket, sendTo: Connection[] = this.connections): Promise<PromiseSettledResult<void>[]> {
    const promiseArray: Promise<void>[] = [];

    for (let i = 0; i < sendTo.length; i++) {
      promiseArray.push(sendTo[i].write(packet));
    }

    return Promise.allSettled(promiseArray);
  }

  /**
   * @internal
   */
  sendUnreliableRootGamePacket(packet: BaseRootPacket, sendTo: Connection[] = this.connections): void {
    for (let i = 0; i < sendTo.length; i++) {
      sendTo[i].writeUnreliable(packet);
    }
  }

  /**
   * @internal
   */
  handleDisconnect(connection: Connection, reason?: DisconnectReason): void {
    this.hostInstance.handleDisconnect(connection, reason);

    const disconnectingConnectionIndex = this.connections.indexOf(connection);
    const disconnectingPlayerIndex = this.findPlayerIndexByConnection(connection);

    if (disconnectingConnectionIndex > -1) {
      this.connections.splice(disconnectingConnectionIndex, 1);
    }

    if (disconnectingPlayerIndex) {
      this.players.splice(disconnectingPlayerIndex, 1);
    }

    if (connection.isHost && this.connections.length > 0) {
      this.migrateHost();
    }

    this.sendRootGamePacket(new RemovePlayerPacket(this.code, connection.id, 0, reason));
  }

  /**
   * @internal
   */
  async handleJoin(connection: Connection): Promise<void> {
    this.getLogger().verbose("Connection %s joining", connection);

    if (this.connections.indexOf(connection) == -1) {
      const count = this.connections.length;

      if (count >= this.options.maxPlayers || count >= this.server.getMaxPlayersPerLobby()) {
        const event = new ServerLobbyJoinRefusedEvent(connection, this);

        await this.server.emit("server.lobby.join.refused", event);

        if (!event.isCancelled()) {
          this.getLogger().verbose("Preventing connection %s from joining full lobby", connection);

          connection.write(new JoinGameErrorPacket(event.getDisconnectReason()));

          return;
        }

        this.getLogger().verbose("Allowing connection %s to join full lobby", connection);
      }
    }

    this.removeActingHosts();

    if (!connection.lobby) {
      connection.lobby = this;

      connection.on("packet", (packet: BaseRootPacket) => {
        this.handlePacket(packet, connection);
      });
    }

    switch (this.gameState) {
      case GameState.NotStarted:
        this.handleNewJoin(connection);
        break;
      case GameState.Ended:
        // TODO: Dead code, InternalHost#endGame sets gameState to NotStarted
        this.handleRejoin(connection);
        break;
      default:
        connection.sendReliable([new JoinGameErrorPacket(DisconnectReasonType.GameStarted)]);
    }
  }

  /**
   * @internal
   */
  sendChat(name: string, color: PlayerColor, message: string | TextComponent, _onLeft: boolean): void {
    if (this.players.length != 0) {
      const oldName = this.players[0].getName();
      const oldColor = this.players[0].getColor();

      this.players[0]
        .setName(name)
        .setColor(color)
        .sendChat(message.toString())
        .setName(oldName)
        .setColor(oldColor);
    }
  }

  /**
   * @internal
   */
  clearMessage(): void {
    // TODO: this *is* possible, somehow
  }

  private handlePacket(packet: BaseRootPacket, sender: Connection): void {
    switch (packet.type) {
      case RootPacketType.AlterGameTag: {
        const data = packet as AlterGameTagPacket;

        this.setGameTag(data.tag, data.value);
        break;
      }
      case RootPacketType.EndGame: {
        const data = packet as EndGamePacket;

        this.gameState = GameState.Ended;

        this.handleEndGame(data.reason, data.showAd);

        for (let i = 0; i < this.connections.length; i++) {
          this.connections[i].limboState = LimboState.PreSpawn;
        }
        break;
      }
      case RootPacketType.GameData:
      case RootPacketType.GameDataTo: {
        if (sender.limboState == LimboState.PreSpawn) {
          return;
        }

        const gameData = packet as GameDataPacket;
        let target: Connection | undefined;

        if (gameData.targetClientId) {
          target = this.findConnection(gameData.targetClientId);
        }

        for (let i = 0; i < gameData.packets.length; i++) {
          this.handleGameDataPacket(gameData.packets[i], sender, target ? [target] : undefined);
        }
        break;
      }
      case RootPacketType.KickPlayer: {
        const data = packet as KickPlayerPacket;
        const id = data.kickedClientId;
        const con = this.findConnection(id);

        if (!con) {
          throw new Error(`KickPlayer sent for unknown client: ${id}`);
        }

        if (sender.isHost) {
          con.sendKick(data.banned, this.findPlayerByConnection(sender), data.disconnectReason);
        }
        break;
      }
      case RootPacketType.RemoveGame: {
        this.handleRemoveGame((packet as RemoveGamePacket).disconnectReason);
        break;
      }
      case RootPacketType.RemovePlayer: {
        if (!packet.isClientBound) {
          const data = packet as LateRejectionPacket;
          const id = data.removedClientId;
          const con = this.findConnection(id);

          if (!con) {
            throw new Error(`SendLateRejection sent for unknown client: ${id}`);
          }

          con.sendLateRejection(data.disconnectReason);
        } else {
          const data = packet as RemovePlayerPacket;

          this.handleRemovePlayer(data.removedClientId, data.hostClientId, data.disconnectReason);
        }
        break;
      }
      case RootPacketType.StartGame: {
        this.handleStartGame();

        this.gameState = GameState.Started;
        break;
      }
      case RootPacketType.WaitForHost: {
        const id = (packet as WaitForHostPacket).waitingClientId;
        const con = this.findConnection(id);

        if (!con) {
          throw new Error(`WaitForHost sent for unknown client: ${id}`);
        }

        con.sendWaitingForHost();
        break;
      }
      case RootPacketType.JoinGame:
        break;
      default:
        throw new Error(`Attempted to handle an unimplemented root game packet type: ${packet.type} (${RootPacketType[packet.type]})`);
    }
  }

  private handleNewJoin(connection: Connection): void {
    if (this.connections.indexOf(connection) == -1) {
      this.connections.push(connection);
    }

    connection.isActingHost = true;
    connection.limboState = LimboState.NotLimbo;

    this.startedSpawningPlayer(connection);
    this.sendJoinedMessage(connection);
    this.broadcastJoinMessage(connection);
  }

  private handleRejoin(connection: Connection): void {
    if (connection.lobby?.code != this.code) {
      connection.sendReliable([new JoinGameErrorPacket(DisconnectReasonType.GameStarted)]);
    }
  }

  private migrateHost(): void {
    // TODO: Assign new acting host if there are none
  }

  private broadcastJoinMessage(connection: Connection): void {
    this.sendRootGamePacket(
      new JoinGameResponsePacket(
        this.code,
        connection.id,
        this.hostInstance.getId(),
      ),
      this.connections
        .filter(con => con.id != connection.id)
        .filter(con => con.limboState == LimboState.NotLimbo),
    );
  }

  private sendJoinedMessage(connection: Connection): void {
    connection.sendReliable([
      new JoinedGamePacket(
        this.code,
        connection.id,
        this.hostInstance.getId(),
        this.connections
          .filter(con => con.id != connection.id && con.limboState == LimboState.NotLimbo)
          .map(con => con.id)),
      new AlterGameTagPacket(
        this.code,
        AlterGameTag.ChangePrivacy,
        this.getGameTag(AlterGameTag.ChangePrivacy) ?? 0),
    ]);
  }

  private handleGameDataPacket(packet: BaseGameDataPacket, sender: Connection, sendTo?: Connection[]): void {
    sendTo = ((sendTo && sendTo.length > 0) ? sendTo : this.connections).filter(c => c.id != sender.id);

    switch (packet.type) {
      case GameDataPacketType.Data:
        if (!this.ignoredNetIds.includes((packet as DataPacket).innerNetObjectID)) {
          this.handleData((packet as DataPacket).innerNetObjectID, (packet as DataPacket).data, sendTo);
        }
        break;
      case GameDataPacketType.Despawn:
        break;
      case GameDataPacketType.RPC:
        if (!this.ignoredNetIds.includes((packet as RPCPacket).senderNetId)) {
          this.rpcHandler.handleBaseRPC(
            (packet as RPCPacket).packet.type,
            sender,
            (packet as RPCPacket).senderNetId,
            (packet as RPCPacket).packet,
            sendTo,
          );
        }
        break;
      case GameDataPacketType.Ready:
        this.hostInstance.handleReady(sender);
        break;
      case GameDataPacketType.SceneChange: {
        if ((packet as SceneChangePacket).scene != "OnlineGame") {
          return;
        }

        const connectionChangingScene = this.findConnection((packet as SceneChangePacket).clientId);

        if (!connectionChangingScene) {
          throw new Error(`SceneChange packet sent for unknown client: ${(packet as SceneChangePacket).clientId}`);
        }

        this.hostInstance.handleSceneChange(connectionChangingScene, (packet as SceneChangePacket).scene);
        break;
      }
      case GameDataPacketType.Spawn:
        break;
      default:
        throw new Error(`Attempted to handle an unimplemented game data packet type: ${packet.type as number} (${GameDataPacketType[packet.type]})`);
    }
  }

  private handleData(netId: number, data: MessageReader | MessageWriter, sendTo?: Connection[]): void {
    const netObject = this.findInnerNetObject(netId);

    if (netObject) {
      const oldNetObject = netObject.clone();

      netObject.data(data);

      if (netObject.type == InnerNetObjectType.CustomNetworkTransform) {
        this.sendUnreliableRootGamePacket(new GameDataPacket([netObject.data(oldNetObject)], this.code), sendTo ?? []);
      } else {
        this.sendRootGamePacket(new GameDataPacket([netObject.data(oldNetObject)], this.code), sendTo ?? []);
      }
    } else {
      throw new Error(`Data packet sent with unknown InnerNetObject ID: ${netId}`);
    }
  }

  private handleAlterGameTag(tag: AlterGameTag, value: number, sendTo?: Connection[]): void {
    this.sendRootGamePacket(new AlterGameTagPacket(this.code, tag, value), sendTo);
  }

  private handleEndGame(reason: GameOverReason, showAd: boolean, sendTo?: Connection[]): void {
    this.sendRootGamePacket(new EndGamePacket(this.code, reason, showAd), sendTo);
  }

  private handleRemoveGame(reason?: DisconnectReason, sendTo?: Connection[]): void {
    this.sendRootGamePacket(new RemoveGamePacket(reason), sendTo);
  }

  private handleStartGame(sendTo?: Connection[]): void {
    this.sendRootGamePacket(new StartGamePacket(this.code), sendTo);
  }

  private handleRemovePlayer(removedClientId: number, hostClientId: number, disconnectReason?: DisconnectReason, sendTo?: Connection[]): void {
    this.sendRootGamePacket(
      new RemovePlayerPacket(this.code, removedClientId, hostClientId, disconnectReason),
      sendTo,
    );
  }
}
