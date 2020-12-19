import { EntityLevel, InnerNetObject, InnerNetObjectType, LobbyImplementation } from "../protocol/entities/types";
import { SpawnInnerNetObject, SpawnPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/spawn";
import { JoinGameErrorPacket, JoinGameResponsePacket } from "../protocol/packets/rootGamePackets/joinGame";
import { LateRejectionPacket, RemovePlayerPacket } from "../protocol/packets/rootGamePackets/removePlayer";
import { GameDataPacket, GameDataPacketDataType } from "../protocol/packets/rootGamePackets/gameData";
import { InnerCustomNetworkTransform } from "../protocol/entities/player/innerCustomNetworkTransform";
import { SceneChangePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/sceneChange";
import { DespawnPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/despawn";
import { RootGamePacketDataType } from "../protocol/packets/packetTypes/genericPacket";
import { EntitySkeldAprilShipStatus } from "../protocol/entities/skeldAprilShipStatus";
import { AlterGameTagPacket } from "../protocol/packets/rootGamePackets/alterGameTag";
import { DataPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/data";
import { InnerVoteBanSystem } from "../protocol/entities/gameData/innerVoteBanSystem";
import { InnerPlayerControl } from "../protocol/entities/player/innerPlayerControl";
import { InnerPlayerPhysics } from "../protocol/entities/player/innerPlayerPhysics";
import { RPCPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpc";
import { WaitForHostPacket } from "../protocol/packets/rootGamePackets/waitForHost";
import { BaseRPCPacket, BaseRootGamePacket } from "../protocol/packets/basePacket";
import { GameDataPacketType, RootGamePacketType } from "../protocol/packets/types";
import { JoinedGamePacket } from "../protocol/packets/rootGamePackets/joinedGame";
import { KickPlayerPacket } from "../protocol/packets/rootGamePackets/kickPlayer";
import { RemoveGamePacket } from "../protocol/packets/rootGamePackets/removeGame";
import { DisconnectionType, DisconnectReason } from "../types/disconnectReason";
import { StartGamePacket } from "../protocol/packets/rootGamePackets/startGame";
import { LobbyListing } from "../protocol/packets/rootGamePackets/getGameList";
import { EntityPolusShipStatus } from "../protocol/entities/polusShipStatus";
import { EntitySkeldShipStatus } from "../protocol/entities/skeldShipStatus";
import { EndGamePacket } from "../protocol/packets/rootGamePackets/endGame";
import { InnerGameData } from "../protocol/entities/gameData/innerGameData";
import { EntityLobbyBehaviour } from "../protocol/entities/lobbyBehaviour";
import { EntityMiraShipStatus } from "../protocol/entities/miraShipStatus";
import { EntityAirshipStatus } from "../protocol/entities/airshipStatus";
import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { EntityGameData } from "../protocol/entities/gameData";
import { GameOptionsData } from "../types/gameOptionsData";
import { EntityPlayer } from "../protocol/entities/player";
import { DEFAULT_GAME_OPTIONS } from "../util/constants";
import { GameOverReason } from "../types/gameOverReason";
import { AlterGameTag } from "../types/alterGameTag";
import { FakeClientId } from "../types/fakeClientId";
import { Connection } from "../protocol/connection";
import { PlayerColor } from "../types/playerColor";
import { notUndefined } from "../util/functions";
import { LimboState } from "../types/limboState";
import { PlayerSkin } from "../types/playerSkin";
import { RemoteInfo } from "../util/remoteInfo";
import { GameState } from "../types/gameState";
import { PlayerHat } from "../types/playerHat";
import { PlayerPet } from "../types/playerPet";
import { SpawnFlag } from "../types/spawnFlag";
import { SpawnType } from "../types/spawnType";
import { HostInstance } from "../host/types";
import { RoomCode } from "../util/roomCode";
import { RPCHandler } from "./rpcHandler";
import { Vector2 } from "../util/vector2";
import { CustomHost } from "../host";
import { Player } from "../player";
import Emittery from "emittery";
import dgram from "dgram";

export type LobbyEvents = {
  connection: Connection;
  player: Player;
  murder: {
    killer: Player;
    victim: Player;
  };
  chat: {
    clientId: number;
    message: string;
  };
  movement: {
    clientId: number;
    sequenceId: number;
    position: Vector2;
    velocity: Vector2;
  };
  nameChanged: {
    clientId: number;
    newName: string;
  };
  colorChanged: {
    clientId: number;
    newColor: PlayerColor;
  };
  petChanged: {
    clientId: number;
    newPet: PlayerPet;
  };
  hatChanged: {
    clientId: number;
    newHat: PlayerHat;
  };
  skinChanged: {
    clientId: number;
    newSkin: PlayerSkin;
  };
  removed: {
    clientId: number;
  };
  enteredVent: {
    clientId: number;
    ventId: number;
  };
  leftVent: {
    clientId: number;
    ventId: number;
  };
  setInfected: number[];
  despawn: InnerNetObject;
};

export class Lobby extends Emittery.Typed<LobbyEvents> implements LobbyImplementation, dgram.RemoteInfo {
  public readonly createdAt: number = Date.now();

  public connections: Connection[] = [];
  public players: Player[] = [];
  public ignoredNetIds: number[] = [];
  public gameState = GameState.NotStarted;
  public customHostInstance?: CustomHost;
  public lobbyBehavior?: EntityLobbyBehaviour;
  public gameData?: EntityGameData;
  public shipStatus?: EntityLevel;
  public meetingHud?: EntityMeetingHud;
  public options: GameOptionsData = DEFAULT_GAME_OPTIONS;
  // TODO: Change back to 0
  public gameTags: Map<AlterGameTag, number> = new Map([[AlterGameTag.ChangePrivacy, 1]]);
  public family: "IPv4" | "IPv6";
  public size = -1;

  private readonly rpcHandler: RPCHandler = new RPCHandler(this);
  private readonly spawningPlayers: Set<Connection> = new Set();

  get host(): HostInstance | undefined {
    if (this.isHost) {
      if (this.customHostInstance) {
        return this.customHostInstance;
      }

      throw new Error("Room cannot be host without a custom host instance");
    } else {
      return this.connections.find(con => con.isHost);
    }
  }

  get actingHosts(): Connection[] {
    return this.connections.filter(con => con.isActingHost);
  }

  get age(): number {
    return (new Date().getTime() - this.createdAt) / 1000;
  }

  get hostName(): string {
    return this.isHost
      ? this.actingHosts[0]?.name ?? this.connections[0].name!
      : (this.host as Connection).name!;
  }

  get lobbyListing(): LobbyListing {
    return new LobbyListing(
      this.address,
      this.port,
      this.code,
      this.hostName,
      this.players.length,
      this.age,
      this.options.options.levels[0],
      this.options.options.impostorCount,
      this.options.options.maxPlayers,
    );
  }

  get isPublic(): boolean {
    return !!(this.gameTags.get(AlterGameTag.ChangePrivacy) ?? 0);
  }

  get isSpawningPlayers(): boolean {
    return this.spawningPlayers.size > 0;
  }

  constructor(
    public address: string,
    public port: number,
    public isHost: boolean,
    public code: string = RoomCode.generate(),
  ) {
    super();

    this.family = RemoteInfo.fromString(`${address}:${port}`).family;

    if (this.isHost) {
      this.customHostInstance = new CustomHost(this);
    }
  }

  finishedSpawningPlayer(connection: Connection): void {
    this.spawningPlayers.delete(connection);
  }

  startedSpawningPlayer(connection: Connection): void {
    this.spawningPlayers.add(connection);
  }

  removeActingHosts(sendImmediately: boolean = true): void {
    for (let i = 0; i < this.actingHosts.length; i++) {
      if (this.actingHosts[i].limboState == LimboState.NotLimbo) {
        this.sendRemoveHost(this.actingHosts[i], sendImmediately);
      }
    }
  }

  reapplyActingHosts(sendImmediately: boolean = true): void {
    for (let i = 0; i < this.actingHosts.length; i++) {
      if (this.actingHosts[i].limboState == LimboState.NotLimbo) {
        this.sendSetHost(this.actingHosts[i], sendImmediately);
      }
    }
  }

  sendSetHost(connection: Connection, sendImmediately: boolean = true): void {
    if (sendImmediately) {
      connection.sendReliable([new JoinGameResponsePacket(this.code, connection.id, connection.id)]);
    } else {
      connection.write(new JoinGameResponsePacket(this.code, connection.id, connection.id));
    }
  }

  sendRemoveHost(connection: Connection, sendImmediately: boolean = true): void {
    if (sendImmediately) {
      connection.sendReliable([new JoinGameResponsePacket(this.code, connection.id, this.host?.id ?? FakeClientId.ServerAsHost)]);
    } else {
      connection.write(new JoinGameResponsePacket(this.code, connection.id, this.host?.id ?? FakeClientId.ServerAsHost));
    }
  }

  setActingHost(connection: Connection, sendImmediately: boolean = true): void {
    connection.isActingHost = true;

    this.sendSetHost(connection, sendImmediately);
  }

  removeActingHost(connection: Connection, sendImmediately: boolean = true): void {
    connection.isActingHost = false;

    this.sendRemoveHost(connection, sendImmediately);
  }

  findInnerNetObject(netId: number): InnerNetObject | undefined {
    switch (netId) {
      case this.lobbyBehavior?.lobbyBehaviour.id:
        return this.lobbyBehavior!.lobbyBehaviour;
      case this.gameData?.gameData.id:
        return this.gameData!.gameData;
      case this.gameData?.voteBanSystem.id:
        return this.gameData!.voteBanSystem;
      case this.shipStatus?.innerNetObjects[0].id:
        //@ts-ignore Talk to Cody about this?
        return this.shipStatus!.innerNetObjects[0];
      case this.meetingHud?.meetingHud.id:
        return this.meetingHud!.meetingHud;
    }

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];

      for (let j = 0; j < player.gameObject.innerNetObjects.length; j++) {
        const object = player.gameObject.innerNetObjects[j];

        if (notUndefined(object) && object.id == netId) {
          return object;
        }
      }
    }

    throw new Error(`InnerNetObject #${netId} not found`);
  }

  findPlayerByConnection(connection: Connection): Player | undefined {
    return this.players.find(player => player.gameObject.owner == connection.id);
  }

  findPlayerByInnerNetObject(netObject: InnerPlayerControl | InnerPlayerPhysics | InnerCustomNetworkTransform): Player | undefined {
    return this.players.find(player => player.gameObject == netObject.parent);
  }

  findConnectionByPlayer(player: Player): Connection | undefined {
    return this.findConnection(player.gameObject.owner);
  }

  findPlayerIndexByConnection(connection: Connection): number {
    return this.players.findIndex(player => player.gameObject.owner == connection.id);
  }

  findConnection(id: number): Connection | undefined {
    return this.connections.find(con => con.id == id);
  }

  handlePacket(packet: RootGamePacketDataType, sender: Connection): void {
    switch (packet.type) {
      case RootGamePacketType.AlterGameTag: {
        const data = packet as AlterGameTagPacket;

        this.handleAlterGameTag(data.tag, data.value);

        this.gameTags.set(data.tag, data.value);
        break;
      }
      case RootGamePacketType.EndGame: {
        const data = packet as EndGamePacket;

        this.gameState = GameState.Ended;

        this.handleEndGame(data.reason, data.showAd);

        for (let i = 0; i < this.connections.length; i++) {
          this.connections[i].limboState = LimboState.PreSpawn;
        }
        break;
      }
      case RootGamePacketType.GameData:
      case RootGamePacketType.GameDataTo: {
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
      case RootGamePacketType.KickPlayer: {
        const data = packet as KickPlayerPacket;
        const id = data.kickedClientId;
        const con = this.findConnection(id);

        if (!con) {
          throw new Error(`KickPlayer sent for unknown client: ${id}`);
        }

        if (sender.isHost) {
          con.sendKick(data.banned, data.disconnectReason);
        }
        break;
      }
      case RootGamePacketType.RemoveGame: {
        this.handleRemoveGame((packet as RemoveGamePacket).disconnectReason);
        break;
      }
      case RootGamePacketType.RemovePlayer: {
        if (!packet.clientBound) {
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
      case RootGamePacketType.StartGame: {
        this.handleStartGame();

        this.gameState = GameState.Started;
        break;
      }
      case RootGamePacketType.WaitForHost: {
        const id = (packet as WaitForHostPacket).waitingClientId;
        const con = this.findConnection(id);

        if (!con) {
          throw new Error(`WaitForHost sent for unknown client: ${id}`);
        }

        con.sendWaitingForHost();
        break;
      }
      case RootGamePacketType.JoinGame:
        break;
      default:
        throw new Error(`Attempted to handle an unimplemented root game packet type: ${packet.type} (${RootGamePacketType[packet.type]})`);
    }
  }

  async sendRootGamePacket(packet: BaseRootGamePacket, sendTo: Connection[] = this.connections): Promise<PromiseSettledResult<void>[]> {
    const promiseArray: Promise<void>[] = [];

    for (let i = 0; i < sendTo.length; i++) {
      promiseArray.push(sendTo[i].write(packet));
    }

    return Promise.allSettled(promiseArray);
  }

  sendUnreliableRootGamePacket(packet: BaseRootGamePacket, sendTo: Connection[] = this.connections): void {
    for (let i = 0; i < sendTo.length; i++) {
      sendTo[i].writeUnreliable(packet);
    }
  }

  sendRPCPacket(from: InnerNetObject, packet: BaseRPCPacket, sendTo?: (Player | HostInstance)[]): void {
    const sendToConnections: Connection[] = new Array(sendTo?.length ?? 0);

    if (sendTo) {
      for (let i = 0; i < sendTo.length; i++) {
        if (sendTo[i] instanceof Connection) {
          sendToConnections[i] = sendTo[i] as Connection;
        } else {
          const connection = this.connections.find(con => this.findPlayerByConnection(con)?.id == sendTo[i].id);

          if (connection) {
            sendToConnections[i] = connection;
          } else {
            throw new Error("Attempted to send a packet to a player with no connection");
          }
        }
      }
    }

    this.sendRootGamePacket(new GameDataPacket([new RPCPacket(from.id, packet)], this.code), sendToConnections);
  }

  handleDisconnect(connection: Connection, reason?: DisconnectReason): void {
    if (this.host instanceof CustomHost) {
      this.host.handleDisconnect(connection);
    }

    const disconnectingConnectionIndex = this.connections.indexOf(connection);
    const disconnectingPlayerIndex = this.findPlayerIndexByConnection(connection);

    if (disconnectingConnectionIndex != -1) {
      this.connections.splice(disconnectingConnectionIndex, 1);
    }

    if (disconnectingPlayerIndex) {
      this.players.splice(disconnectingPlayerIndex, 1);
    }

    if (connection.isHost && this.connections.length > 0) {
      this.migrateHost();
    }

    // console.log("handleDisconnect host id", this.host?.id ?? 0);

    this.sendRootGamePacket(new RemovePlayerPacket(this.code, connection.id, this.host?.id ?? 0, reason));
  }

  handleJoin(connection: Connection): void {
    if (!this.isHost && this.connections.length >= 10) {
      connection.sendReliable([new JoinGameErrorPacket(DisconnectionType.GameFull)]);
    }

    this.removeActingHosts();

    if (!connection.room) {
      connection.room = this;

      connection.on("packet", (packet: RootGamePacketDataType) => {
        this.handlePacket(packet, connection);
      });
    }

    switch (this.gameState) {
      case GameState.NotStarted:
        this.handleNewJoin(connection);
        break;
      case GameState.Ended:
        this.handleRejoin(connection);
        break;
      default:
        connection.sendReliable([new JoinGameErrorPacket(DisconnectionType.GameStarted)]);
    }
  }

  despawn(innerNetObject: InnerNetObject): void {
    if (!this.isHost) {
      this.handleDespawn(innerNetObject.id);
    }

    this.emit("despawn", innerNetObject);

    this.sendRootGamePacket(new GameDataPacket([new DespawnPacket(innerNetObject.id)], this.code));
  }

  private handleNewJoin(connection: Connection): void {
    if (this.connections.indexOf(connection) == -1) {
      this.connections.push(connection);
    }

    if (!this.isHost && !this.host) {
      connection.isHost = true;
    } else if (this.isHost) {
      // TODO: This will make everyone an acting host
      connection.isActingHost = true;
    }

    connection.limboState = LimboState.NotLimbo;

    this.startedSpawningPlayer(connection);
    this.sendJoinedMessage(connection);
    this.broadcastJoinMessage(connection);

    this.emit("connection", connection);
  }

  private handleRejoin(connection: Connection): void {
    if (connection.room?.code != this.code) {
      connection.sendReliable([new JoinGameErrorPacket(DisconnectionType.GameStarted)]);

      return;
    }

    if (!this.isHost && !this.host) {
      connection.isHost = true;
    }

    if (this.isHost) {
      if (this.gameState == GameState.Ended) {
        this.gameState = GameState.NotStarted;
      }

      this.handleNewJoin(connection);
    } else if (connection.isHost) {
      this.gameState = GameState.NotStarted;

      this.handleNewJoin(connection);
      this.takeFromLimbo(this.connections.filter(con => con.id != connection.id));
    } else {
      this.sendToLimbo(connection);
    }
  }

  private sendToLimbo(connection: Connection): void {
    connection.limboState = LimboState.WaitingForHost;

    connection.sendReliable([new WaitForHostPacket(this.code, connection.id)]);

    this.broadcastJoinMessage(connection);
  }

  private takeFromLimbo(connections: Connection[]): void {
    connections.filter(con => con.limboState == LimboState.WaitingForHost).forEach(con => {
      this.sendJoinedMessage(con);

      con.limboState = LimboState.NotLimbo;
    });
  }

  private migrateHost(): void {
    // If the server is the host
    if (this.isHost) {
      // TODO: Assign new acting host if there are none
      return;
    }

    // Don't change code below this point as it is for client-as-host logic.

    // If we already have a client that is host then we don't need to migrate.
    if (this.host) {
      return;
    }

    /**
     * Host priority:
     *  1. First connection that is already in the lobby ("NotLimbo")
     *     (if the host left while they and someone else were in the lobby)
     *  2. First connection that clicked "Play Again" ("WaitingForHost")
     *     (if the host left after one or more clients clicked "Play Again")
     *  3. First connection in line
     *     (if the host left and nobody clicked "Play Again" yet)
     */
    const newHost = this.connections.find(con => con.limboState == LimboState.NotLimbo)
      ?? this.connections.find(con => con.limboState == LimboState.WaitingForHost)
      ?? this.connections[0];

    newHost.isHost = true;

    if (this.gameState == GameState.Ended && newHost.limboState == LimboState.WaitingForHost) {
      this.handleRejoin(newHost);
    }
  }

  private broadcastJoinMessage(connection: Connection): void {
    this.sendRootGamePacket(
      new JoinGameResponsePacket(
        this.code,
        connection.id,
        this.isHost ? FakeClientId.ServerAsHost : this.host!.id,
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
        this.isHost ? FakeClientId.ServerAsHost : this.host!.id,
        this.connections
          .filter(con => con.id != connection.id && con.limboState == LimboState.NotLimbo)
          .map(con => con.id)),
      new AlterGameTagPacket(
        this.code,
        AlterGameTag.ChangePrivacy,
        this.gameTags.get(AlterGameTag.ChangePrivacy) ?? 0),
    ]);
  }

  private handleGameDataPacket(packet: GameDataPacketDataType, sender: Connection, sendTo?: Connection[]): void {
    sendTo = ((sendTo && sendTo.length > 0) ? sendTo : this.connections).filter(c => c.id != sender.id);

    switch (packet.type) {
      case GameDataPacketType.Data:
        if (!this.ignoredNetIds.includes((packet as DataPacket).innerNetObjectID)) {
          this.handleData((packet as DataPacket).innerNetObjectID, (packet as DataPacket).data, sendTo);
        }
        break;
      case GameDataPacketType.Despawn:
        if (sender.isHost && !this.ignoredNetIds.includes((packet as DespawnPacket).innerNetObjectID)) {
          this.handleDespawn((packet as DespawnPacket).innerNetObjectID, sendTo);
        }
        break;
      case GameDataPacketType.RPC:
        if (!this.ignoredNetIds.includes((packet as RPCPacket).senderNetId)) {
          this.rpcHandler.handleBaseRPC(
            (packet as RPCPacket).packet.type,
            (packet as RPCPacket).senderNetId,
            (packet as RPCPacket).packet,
            sendTo,
          );
        }
        break;
      case GameDataPacketType.Ready:
        if (!this.host) {
          throw new Error("Ready packet received without a host");
        }

        this.host.handleReady(sender);
        break;
      case GameDataPacketType.SceneChange: {
        if ((packet as SceneChangePacket).scene != "OnlineGame") {
          return;
        }

        if (!this.host) {
          throw new Error("SceneChange packet received without a host");
        }

        const connectionChangingScene = this.findConnection((packet as SceneChangePacket).clientId);

        if (!connectionChangingScene) {
          throw new Error(`SceneChange packet sent for unknown client: ${(packet as SceneChangePacket).clientId}`);
        }

        this.host.handleSceneChange(connectionChangingScene, (packet as SceneChangePacket).scene);
        break;
      }
      case GameDataPacketType.Spawn:
        this.handleSpawn(
          (packet as SpawnPacket).spawnType,
          (packet as SpawnPacket).flags,
          (packet as SpawnPacket).owner,
          (packet as SpawnPacket).innerNetObjects,
          sendTo,
        );
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
        this.emit("movement", {
          clientId: netObject.parent.owner,
          sequenceId: (netObject as InnerCustomNetworkTransform).sequenceId,
          position: (netObject as InnerCustomNetworkTransform).position,
          velocity: (netObject as InnerCustomNetworkTransform).velocity,
        });

        //@ts-ignore Talk to Cody about this?
        this.sendUnreliableRootGamePacket(new GameDataPacket([netObject.data(oldNetObject)], this.code), sendTo ?? []);
      } else {
      //@ts-ignore Talk to Cody about this?
        this.sendRootGamePacket(new GameDataPacket([netObject.data(oldNetObject)], this.code), sendTo ?? []);
      }
    } else {
      throw new Error(`Data packet sent with unknown InnerNetObject ID: ${netId}`);
    }
  }

  private handleSpawn(type: SpawnType, flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], sendTo?: Connection[]): void {
    switch (type) {
      case SpawnType.ShipStatus: {
        if (this.shipStatus && this.isHost) {
          throw new Error("Received duplicate spawn packet for ShipStatus");
        }

        this.shipStatus = EntitySkeldShipStatus.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.shipStatus.spawn()], this.code), sendTo);
        break;
      }
      case SpawnType.AprilShipStatus: {
        if (this.shipStatus && this.isHost) {
          throw new Error("Received duplicate spawn packet for AprilShipStatus");
        }

        this.shipStatus = EntitySkeldAprilShipStatus.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.shipStatus.spawn()], this.code), sendTo);
        break;
      }
      case SpawnType.Headquarters: {
        if (this.shipStatus && this.isHost) {
          throw new Error("Received duplicate spawn packet for Headquarters");
        }

        this.shipStatus = EntityMiraShipStatus.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.shipStatus.spawn()], this.code), sendTo);
        break;
      }
      case SpawnType.PlanetMap: {
        if (this.shipStatus && this.isHost) {
          throw new Error("Received duplicate spawn packet for PlanetMap");
        }

        this.shipStatus = EntityPolusShipStatus.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.shipStatus.spawn()], this.code), sendTo);
        break;
      }
      case SpawnType.Airship: {
        if (this.shipStatus && this.isHost) {
          throw new Error("Received duplicate spawn packet for AirShip");
        }

        this.shipStatus = EntityAirshipStatus.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.shipStatus.spawn()], this.code), sendTo);
        break;
      }
      case SpawnType.GameData: {
        if (this.gameData && this.isHost) {
          throw new Error("Received duplicate spawn packet for GameData");
        }

        this.gameData = EntityGameData.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.gameData.spawn()], this.code), sendTo);
        break;
      }
      case SpawnType.LobbyBehaviour: {
        if (this.lobbyBehavior && this.isHost) {
          throw new Error("Received duplicate spawn packet for LobbyBehaviour");
        }

        this.lobbyBehavior = EntityLobbyBehaviour.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.lobbyBehavior.spawn()], this.code), sendTo);
        break;
      }
      case SpawnType.MeetingHud: {
        if (this.meetingHud && this.isHost) {
          throw new Error("Received duplicate spawn packet for MeetingHud");
        }

        this.meetingHud = EntityMeetingHud.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.meetingHud.spawn()], this.code), sendTo);
        break;
      }
      case SpawnType.PlayerControl: {
        const connection = this.findConnection(owner);

        if (!connection) {
          throw new Error("Spawn packet sent for a player on a connection that does not exist");
        }

        this.players.push(new Player(EntityPlayer.spawn(flags, owner, innerNetObjects, this)));

        this.sendRootGamePacket(new GameDataPacket([this.findPlayerByConnection(connection)!.gameObject.spawn()], this.code), sendTo);
        break;
      }
    }
  }

  private deleteIfEmpty(prop: string): void {
    if (this[prop].innerNetObjects.filter(notUndefined).length == 0) {
      delete this[prop];
    }
  }

  private handleDespawn(netId: number, sendTo?: Connection[]): void {
    if (this.isHost) {
      return;
    }

    const innerNetObject = this.findInnerNetObject(netId);

    if (!innerNetObject) {
      throw new Error("Attempted to despawn an InnerNetObject that does not exist");
    }

    let connection: Connection | undefined;

    if (
      innerNetObject.type == InnerNetObjectType.PlayerControl ||
      innerNetObject.type == InnerNetObjectType.PlayerPhysics ||
      innerNetObject.type == InnerNetObjectType.CustomNetworkTransform
    ) {
      connection = this.findConnection(innerNetObject.parent.owner);

      if (!connection) {
        throw new Error("Attempted to despawn a player that has no connection");
      }

      if (!this.findPlayerByConnection(connection)) {
        throw new Error("Attempted to despawn a player whose connection object is missing a player instance");
      }
    }

    switch (innerNetObject.type) {
      case InnerNetObjectType.SkeldShipStatus:
      case InnerNetObjectType.SkeldAprilShipStatus:
      case InnerNetObjectType.MiraShipStatus:
      case InnerNetObjectType.PolusShipStatus:
      case InnerNetObjectType.AirshipStatus:
        if (!this.shipStatus) {
          throw new Error("Attempted to despawn ShipStatus that is not currently spawned");
        }

        delete this.shipStatus;
        break;
      case InnerNetObjectType.VoteBanSystem:
        if (!this.gameData) {
          throw new Error("Attempted to despawn VoteBanSystem that is not currently spawned");
        }

        this.gameData.innerNetObjects[1] = undefined as unknown as InnerVoteBanSystem;

        this.deleteIfEmpty("gameData");
        break;
      case InnerNetObjectType.GameData:
        if (!this.gameData) {
          throw new Error("Attempted to despawn GameData that is not currently spawned");
        }

        this.gameData.innerNetObjects[0] = undefined as unknown as InnerGameData;

        this.deleteIfEmpty("gameData");
        break;
      case InnerNetObjectType.LobbyBehaviour:
        if (!this.lobbyBehavior) {
          throw new Error("Attempted to despawn LobbyBehaviour that is not currently spawned");
        }

        delete this.lobbyBehavior;
        break;
      case InnerNetObjectType.MeetingHud:
        if (!this.meetingHud) {
          throw new Error("Attempted to despawn MeetingHud that is not currently spawned");
        }

        delete this.meetingHud;
        break;
      case InnerNetObjectType.PlayerControl:
        this.findPlayerByConnection(connection!)!.gameObject.innerNetObjects[0] = undefined as unknown as InnerPlayerControl;

        if (this.findPlayerByConnection(connection!)!.gameObject.innerNetObjects.filter(notUndefined).length == 0) {
          this.players.splice(this.findPlayerIndexByConnection(connection!));
        }
        break;
      case InnerNetObjectType.PlayerPhysics:
        this.findPlayerByConnection(connection!)!.gameObject.innerNetObjects[1] = undefined as unknown as InnerPlayerPhysics;

        if (this.findPlayerByConnection(connection!)!.gameObject.innerNetObjects.filter(notUndefined).length == 0) {
          this.players.splice(this.findPlayerIndexByConnection(connection!));
        }
        break;
      case InnerNetObjectType.CustomNetworkTransform:
        this.findPlayerByConnection(connection!)!.gameObject.innerNetObjects[2] = undefined as unknown as InnerCustomNetworkTransform;

        if (this.findPlayerByConnection(connection!)!.gameObject.innerNetObjects.filter(notUndefined).length == 0) {
          this.players.splice(this.findPlayerIndexByConnection(connection!));
        }
        break;
    }

    this.sendRootGamePacket(
      new GameDataPacket(
        [new DespawnPacket(innerNetObject.id)],
        this.code,
      ),
      sendTo,
    );
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
