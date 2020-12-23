import { InnerCustomNetworkTransform, InnerPlayerControl, InnerPlayerPhysics } from "../protocol/entities/player";
import { DataPacket, DespawnPacket, RPCPacket, SceneChangePacket } from "../protocol/packets/gameData";
import { BaseEntityShipStatus } from "../protocol/entities/baseShipStatus/baseEntityShipStatus";
import { GameDataPacketDataType, LobbyListing } from "../protocol/packets/root/types";
import { GameDataPacketType, RootPacketType } from "../protocol/packets/types/enums";
import { BaseInnerNetObject, LobbyImplementation } from "../protocol/entities/types";
import { EntityLobbyBehaviour } from "../protocol/entities/lobbyBehaviour";
import { InnerNetObjectType } from "../protocol/entities/types/enums";
import { RootPacketDataType } from "../protocol/packets/hazel/types";
import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { EntityGameData } from "../protocol/entities/gameData";
import { DisconnectReason, GameOptionsData } from "../types";
import { BaseRPCPacket } from "../protocol/packets/rpc";
import { Connection } from "../protocol/connection";
import { CustomHost, HostInstance } from "../host";
import { notUndefined } from "../util/functions";
import { RemoteInfo } from "../util/remoteInfo";
import { LobbyCode } from "../util/lobbyCode";
import { RPCHandler } from "./rpcHandler";
import { Player } from "../player";
import { LobbyEvents } from ".";
import Emittery from "emittery";
import dgram from "dgram";
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
  GameOverReason,
  GameState,
  LimboState,
} from "../types/enums";

export class Lobby extends Emittery.Typed<LobbyEvents> implements LobbyImplementation, dgram.RemoteInfo {
  public readonly createdAt: number = Date.now();

  public connections: Connection[] = [];
  public players: Player[] = [];
  public ignoredNetIds: number[] = [];
  public gameState = GameState.NotStarted;
  public customHostInstance: CustomHost;
  public lobbyBehavior?: EntityLobbyBehaviour;
  public gameData?: EntityGameData;
  public shipStatus?: BaseEntityShipStatus;
  public meetingHud?: EntityMeetingHud;
  public options: GameOptionsData = new GameOptionsData();
  // TODO: Change back to 0
  public gameTags: Map<AlterGameTag, number> = new Map([[AlterGameTag.ChangePrivacy, 1]]);
  public family: "IPv4" | "IPv6";
  public size = -1;

  private readonly rpcHandler: RPCHandler = new RPCHandler(this);
  private readonly spawningPlayers: Set<Connection> = new Set();

  constructor(
    public address: string,
    public port: number,
    public code: string = LobbyCode.generate(),
  ) {
    super();

    this.family = RemoteInfo.fromString(`${address}:${port}`).family;

    this.customHostInstance = new CustomHost(this);
  }

  getActingHosts(): Connection[] {
    return this.connections.filter(con => con.isActingHost);
  }

  getAge(): number {
    return (new Date().getTime() - this.createdAt) / 1000;
  }

  getHostName(): string {
    return this.getActingHosts()[0]?.name ?? this.connections[0].name!;
  }

  getLobbyListing(): LobbyListing {
    return new LobbyListing(
      this.address,
      this.port,
      this.code,
      this.getHostName(),
      this.players.length,
      this.getAge(),
      this.options.levels[0],
      this.options.impostorCount,
      this.options.maxPlayers,
    );
  }

  isPublic(): boolean {
    return !!(this.gameTags.get(AlterGameTag.ChangePrivacy) ?? 0);
  }

  isSpawningPlayers(): boolean {
    return this.spawningPlayers.size > 0;
  }

  finishedSpawningPlayer(connection: Connection): void {
    this.spawningPlayers.delete(connection);
  }

  startedSpawningPlayer(connection: Connection): void {
    this.spawningPlayers.add(connection);
  }

  removeActingHosts(sendImmediately: boolean = true): void {
    const actingHosts = this.getActingHosts();

    for (let i = 0; i < actingHosts.length; i++) {
      if (actingHosts[i].limboState == LimboState.NotLimbo) {
        this.sendRemoveHost(actingHosts[i], sendImmediately);
      }
    }
  }

  reapplyActingHosts(sendImmediately: boolean = true): void {
    const actingHosts = this.getActingHosts();

    for (let i = 0; i < actingHosts.length; i++) {
      if (actingHosts[i].limboState == LimboState.NotLimbo) {
        this.sendSetHost(actingHosts[i], sendImmediately);
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
      connection.sendReliable([new JoinGameResponsePacket(this.code, connection.id, this.customHostInstance.id)]);
    } else {
      connection.write(new JoinGameResponsePacket(this.code, connection.id, this.customHostInstance.id));
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

  findInnerNetObject(netId: number): BaseInnerNetObject | undefined {
    switch (netId) {
      case this.lobbyBehavior?.lobbyBehaviour.netId:
        return this.lobbyBehavior!.lobbyBehaviour;
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

      for (let j = 0; j < player.gameObject.innerNetObjects.length; j++) {
        const object = player.gameObject.innerNetObjects[j];

        if (notUndefined(object) && object.netId == netId) {
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

  handlePacket(packet: RootPacketDataType, sender: Connection): void {
    switch (packet.type) {
      case RootPacketType.AlterGameTag: {
        const data = packet as AlterGameTagPacket;

        this.handleAlterGameTag(data.tag, data.value);

        this.gameTags.set(data.tag, data.value);
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
          con.sendKick(data.banned, data.disconnectReason);
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

  async sendRootGamePacket(packet: BaseRootPacket, sendTo: Connection[] = this.connections): Promise<PromiseSettledResult<void>[]> {
    const promiseArray: Promise<void>[] = [];

    for (let i = 0; i < sendTo.length; i++) {
      promiseArray.push(sendTo[i].write(packet));
    }

    return Promise.allSettled(promiseArray);
  }

  sendUnreliableRootGamePacket(packet: BaseRootPacket, sendTo: Connection[] = this.connections): void {
    for (let i = 0; i < sendTo.length; i++) {
      sendTo[i].writeUnreliable(packet);
    }
  }

  sendRPCPacket(from: BaseInnerNetObject, packet: BaseRPCPacket, sendTo?: (Player | HostInstance)[]): void {
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

    this.sendRootGamePacket(new GameDataPacket([new RPCPacket(from.netId, packet)], this.code), sendToConnections);
  }

  handleDisconnect(connection: Connection, reason?: DisconnectReason): void {
    this.customHostInstance.handleDisconnect(connection);

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

    // console.log("handleDisconnect host id", 0);

    this.sendRootGamePacket(new RemovePlayerPacket(this.code, connection.id, 0, reason));
  }

  handleJoin(connection: Connection): void {
    this.removeActingHosts();

    if (!connection.lobby) {
      connection.lobby = this;

      connection.on("packet", (packet: RootPacketDataType) => {
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
        connection.sendReliable([new JoinGameErrorPacket(DisconnectReasonType.GameStarted)]);
    }
  }

  despawn(innerNetObject: BaseInnerNetObject): void {
    this.emit("despawn", innerNetObject);

    this.sendRootGamePacket(new GameDataPacket([new DespawnPacket(innerNetObject.netId)], this.code));
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

    this.emit("connection", connection);
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
        this.customHostInstance.id,
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
        this.customHostInstance.id,
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
        this.customHostInstance.handleReady(sender);
        break;
      case GameDataPacketType.SceneChange: {
        if ((packet as SceneChangePacket).scene != "OnlineGame") {
          return;
        }

        const connectionChangingScene = this.findConnection((packet as SceneChangePacket).clientId);

        if (!connectionChangingScene) {
          throw new Error(`SceneChange packet sent for unknown client: ${(packet as SceneChangePacket).clientId}`);
        }

        this.customHostInstance.handleSceneChange(connectionChangingScene, (packet as SceneChangePacket).scene);
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
        this.emit("movement", {
          clientId: netObject.parent.owner,
          sequenceId: (netObject as InnerCustomNetworkTransform).sequenceId,
          position: (netObject as InnerCustomNetworkTransform).position,
          velocity: (netObject as InnerCustomNetworkTransform).velocity,
        });

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
