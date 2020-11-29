import { SpawnPacket, SpawnInnerNetObject } from "../protocol/packets/rootGamePackets/gameDataPackets/spawn";
import { LateRejectionPacket, RemovePlayerPacket } from "../protocol/packets/rootGamePackets/removePlayer";
import { GameDataPacket, GameDataPacketDataType } from "../protocol/packets/rootGamePackets/gameData";
import { SceneChangePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/sceneChange";
import { DespawnPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/despawn";
import { RootGamePacketDataType } from "../protocol/packets/packetTypes/genericPacket";
import { AlterGameTagPacket } from "../protocol/packets/rootGamePackets/alterGameTag";
import { DataPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/data";
import { RPCPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpc";
import { WaitForHostPacket } from "../protocol/packets/rootGamePackets/waitForHost";
import { BaseRootGamePacket, BaseRPCPacket } from "../protocol/packets/basePacket";
import { RootGamePacketType, GameDataPacketType } from "../protocol/packets/types";
import { KickPlayerPacket } from "../protocol/packets/rootGamePackets/kickPlayer";
import { RemoveGamePacket } from "../protocol/packets/rootGamePackets/removeGame";
import { StartGamePacket } from "../protocol/packets/rootGamePackets/startGame";
import { InnerNetObject, RoomImplementation } from "../protocol/entities/types";
import { EntityAprilShipStatus } from "../protocol/entities/aprilShipStatus";
import { EndGamePacket } from "../protocol/packets/rootGamePackets/endGame";
import { EntityLobbyBehaviour } from "../protocol/entities/lobbyBehaviour";
import { EntityHeadquarters } from "../protocol/entities/headquarters";
import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { EntityShipStatus } from "../protocol/entities/shipStatus";
import { EntityPlanetMap } from "../protocol/entities/planetMap";
import { EntityGameData } from "../protocol/entities/gameData";
import { DisconnectReason } from "../types/disconnectReason";
import { GameOptionsData } from "../types/gameOptionsData";
import { EntityPlayer } from "../protocol/entities/player";
import { Entity } from "../protocol/entities/baseEntity";
import { GameOverReason } from "../types/gameOverReason";
import { TaskBarUpdate } from "../types/taskBarUpdate";
import { KillDistance } from "../types/killDistance";
import { AlterGameTag } from "../types/alterGameTag";
import { Connection } from "../protocol/connection";
import { SpawnFlag } from "../types/spawnFlag";
import { SpawnType } from "../types/spawnType";
import { Language } from "../types/language";
import { HostInstance } from "../host/types";
import { RoomCode } from "../util/roomCode";
import { Level } from "../types/level";
import { Player } from "../player";
import Emittery from "emittery";
import { notUndefined } from "../util/functions";
import { RPCHandler } from "./rpcHandler";

export type RoomEventTypes = {
  connectionJoin: Connection,
};

export class Room extends Emittery.Typed<RoomEventTypes> implements RoomImplementation {
  public connections: Connection[] = [];
  public isHost: boolean = true;
  public customHostInstance?: CustomHost;
  public lobbyBehavior?: EntityLobbyBehaviour;
  public gameData?: EntityGameData;
  public shipStatus?: EntityShipStatus | EntityAprilShipStatus | EntityHeadquarters | EntityPlanetMap;
  public meetingHud?: EntityMeetingHud;
  public options: GameOptionsData = new GameOptionsData({
    length: 46,
    version: 4,
    maxPlayers: 10,
    languages: [Language.Other],
    levels: [Level.Polus],
    playerSpeedModifier: 1,
    crewLightModifier: 1,
    impostorLightModifier: 1.5,
    killCooldown: 45,
    commonTasks: 1,
    longTasks: 1,
    shortTasks: 2,
    emergencies: 1,
    impostorCount: 2,
    killDistance: KillDistance.Medium,
    discussionTime: 15,
    votingTime: 120,
    isDefault: true,
    emergencyCooldown: 15,
    confirmEjects: true,
    visualTasks: true,
    anonymousVoting: false,
    taskBarUpdates: TaskBarUpdate.Always,
  });

  private RPCHandler: RPCHandler = new RPCHandler(this);

  public get players(): Player[] {
    return this.connections.map(con => con.player).filter(notUndefined);
  }

  public get host(): HostInstance {
    if (this.isHost) {
      if (this.customHostInstance) {
        // TODO: implement
        // @ts-expect-error
        return this.customHostInstance;
      } else {
        throw new Error("Room is host without a custom host instance");
      }
    } else {
      let host = this.connections.find((c: Connection) => c.isHost);

      if (host) {
        return host;
      } else {
        throw new Error("Room has no connection assigned as host");
      }
    }
  }

  public findInnerNetObject(netId: number): InnerNetObject | undefined {
    switch (netId) {
      case this.lobbyBehavior?.lobbyBehaviour.id:
        return this.lobbyBehavior!.lobbyBehaviour;
      case this.gameData?.gameData.id:
        return this.gameData!.gameData;
      case this.gameData?.voteBanSystem.id:
        return this.gameData!.voteBanSystem;
      case this.shipStatus?.innerNetObjects[0].id:
        return this.shipStatus!.innerNetObjects[0];
      case this.meetingHud?.meetingHud.id:
        return this.meetingHud!.meetingHud;
    }

    for (let i = 0; i < this.players.length; i++) {
      let player = this.players[i];

      switch (netId) {
        case player.gameObject.playerControl.id:
          return player.gameObject.playerControl;
        case player.gameObject.playerPhysics.id:
          return player.gameObject.playerPhysics;
        case player.gameObject.customNetworkTransform.id:
          return player.gameObject.customNetworkTransform;
      }
    }
  }

  constructor(public readonly code: string = RoomCode.generate()) {
    super();

    if (!this.isHost) {
      this.once("connectionJoin").then((con: Connection) => {
        con.isHost = true;
      });
    } else {
      this.customHostInstance = new CustomHost();
    }

    this.on("connectionJoin", (con: Connection) => {
      con.on("packet", packet => this.handlePacket(packet, con));
    });
  }

  findConnection(id: number): Connection | undefined {
    return this.connections.find(con => con.id == id);
  }

  handlePacket(packet: RootGamePacketDataType, sender: Connection) {
    switch (packet.type) {
      case RootGamePacketType.AlterGameTag: {
        let data = (<AlterGameTagPacket>packet);

        this.handleAlterGameTag(data.tag, data.value);
        break;
      }
      case RootGamePacketType.EndGame: {
        let data = (<EndGamePacket>packet);

        this.handleEndGame(data.reason, data.showAd);
        break;
      }
      case RootGamePacketType.GameData:
      case RootGamePacketType.GameDataTo: {
        let gameData = <GameDataPacket>packet;
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
        let data = (<KickPlayerPacket>packet);
        let id = data.kickedClientId;
        let con = this.findConnection(id);
        
        if (!con) {
          throw new Error("KickPlayer sent for unknown connection: " + id);
        }

        con.sendKick(data.banned, data.disconnectReason);
        break;
      }
      case RootGamePacketType.RemoveGame: {
        this.handleRemoveGame((<RemoveGamePacket>packet).disconnectReason);
        break;
      }
      case RootGamePacketType.RemovePlayer: {
        if (!packet.clientBound) {
          let data = (<LateRejectionPacket>packet);
          let id = data.removedClientId;
          let con = this.findConnection(id);
          
          if (!con) {
            throw new Error("SendLateRejection sent for unknown connection: " + id);
          }

          con.sendLateRejection(data.disconnectReason);
        } else {
          let data = (<RemovePlayerPacket>packet);

          this.handleRemovePlayer(data.removedClientId, data.hostClientId, data.disconnectReason);
        }
        break;
      }
      case RootGamePacketType.StartGame: {
        this.handleStartGame();
        break;
      }
      case RootGamePacketType.WaitForHost: {
        let id = (<WaitForHostPacket>packet).waitingClientId;
        let con = this.findConnection(id);
        
        if (!con) {
          throw new Error("WaitForHost sent for unknown connection: " + id);
        }

        con.sendWaitingForHost();
      }
      default:
        throw new Error("Unhandled root game packet type: " + packet.type);
    }
  }

  sendRootGamePacket(packet: BaseRootGamePacket, sendTo: Connection[] = this.connections) {
    for (let i = 0; i < sendTo.length; i++) {
      sendTo[i].write(packet);
    }
  }
  
  sendRPCPacket(from: InnerNetObject, packet: BaseRPCPacket, sendTo?: (Player | HostInstance)[]) {
    let sendToConnections: Connection[] = new Array(sendTo?.length);
    
    if (!sendTo) {
      sendToConnections = this.connections.filter(c => c.id != from.id);
    } else {
      for (let i = 0; i < sendTo.length; i++) {
        if(sendTo[i] instanceof Connection) {
          sendToConnections.push(<Connection>sendTo[i])
        } else {
          let con = this.connections.find(c => c.player?.id == sendTo[i].id)
          if(con) {
            sendToConnections.push(con)
          } else {
            throw new Error("Attempted to send packet to a player with no associated connection.")
          }
        }
      }
    }

    this.sendRootGamePacket(new GameDataPacket([
      new RPCPacket(from.id, packet)
    ]), <Connection[]>sendTo);
  }

  private handleGameDataPacket(packet: GameDataPacketDataType, sender: Connection, sendTo?: Connection[]) {
    switch (packet.type) {
      case GameDataPacketType.Data:
        this.handleData((<DataPacket>packet).innerNetObjectID, (<DataPacket>packet).data, sendTo);
        break;
      case GameDataPacketType.Despawn:
        this.handleDespawn((<DespawnPacket>packet).innerNetObjectID, sendTo);
        break;
      case GameDataPacketType.RPC:
        //TODO: add multiple receivers support
        this.RPCHandler.handleBaseRPC((<RPCPacket>packet).packet.type, (<RPCPacket>packet).senderNetId, (<RPCPacket>packet).packet, sendTo ? sendTo[0] : undefined)
        break;
      case GameDataPacketType.Ready:
        this.host.handleReady(sender);
        break;
      case GameDataPacketType.SceneChange: {
        let connectionChangingScene = this.findConnection((<SceneChangePacket>packet).clientId);

        if (!connectionChangingScene) {
          throw new Error("SceneChange packet sent for unknown connection!: " + (<SceneChangePacket>packet).clientId);
        }

        this.host.handleSceneChange(connectionChangingScene, (<SceneChangePacket>packet).scene);
        break;
      }
      case GameDataPacketType.Spawn:
        this.handleSpawn(
          (<SpawnPacket>packet).type, 
          (<SpawnPacket>packet).flags,
          (<SpawnPacket>packet).owner,
          (<SpawnPacket>packet).innerNetObjects,
          sendTo,
        );
        break;
      default:
        throw new Error("Unhandled game data packet type: " + packet.type);
    }
  }

  private handleData(netId: number, data: MessageReader | MessageWriter, sendTo?: Connection[]) {
    let netObject = this.findInnerNetObject(netId);

    if (netObject) {
      let oldNetObject = Object.assign({}, netObject);

      netObject.data(data);
      this.sendRootGamePacket(new GameDataPacket([netObject.data(oldNetObject)]), sendTo);
    } else {
      throw new Error("Data packet sent with unknown NetID: " + netId);
    }
  }

  private handleSpawn(type: SpawnType, flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], sendTo?: Connection[]) {
    switch (type) {
      case SpawnType.ShipStatus:
        if (this.shipStatus)
          throw new Error("Duplicate spawn packet sent for ShipStatus");
        
        this.shipStatus = EntityShipStatus.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.shipStatus.spawn()]), sendTo);
        break;
      case SpawnType.AprilShipStatus:
        if (this.shipStatus)
          throw new Error("Duplicate spawn packet sent for AprilShipStatus");

        this.shipStatus = EntityAprilShipStatus.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.shipStatus.spawn()]), sendTo);
        break;
      case SpawnType.Headquarters:
        if (this.shipStatus)
          throw new Error("Duplicate spawn packet sent for Headquarters");

        this.shipStatus = EntityHeadquarters.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.shipStatus.spawn()]), sendTo);
        break;
      case SpawnType.PlanetMap:
        if (this.shipStatus)
          throw new Error("Duplicate spawn packet sent for PlanetMap");

        this.shipStatus = EntityPlanetMap.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.shipStatus.spawn()]), sendTo);
        break;
      case SpawnType.GameData:
        if (this.gameData)
          throw new Error("Duplicate spawn packet sent for GameData");

        this.gameData = EntityGameData.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.gameData.spawn()]), sendTo);
        break;
      case SpawnType.LobbyBehaviour:
        if (this.lobbyBehavior)
          throw new Error("Duplicate spawn packet sent for LobbyBehaviour");

        this.lobbyBehavior = EntityLobbyBehaviour.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.lobbyBehavior.spawn()]), sendTo);
        break;
      case SpawnType.MeetingHud:
        if (this.meetingHud)
          throw new Error("Duplicate spawn packet sent for MeetingHud");

        this.meetingHud = EntityMeetingHud.spawn(flags, owner, innerNetObjects, this);

        this.sendRootGamePacket(new GameDataPacket([this.meetingHud.spawn()]), sendTo);
        break;
      case SpawnType.PlayerControl:
        let connection = this.findConnection(owner);

        if (!connection)
          throw new Error("Spawn packet sent for a player on a connection that does not exist")
        
        connection.player = new Player(EntityPlayer.spawn(flags, owner, innerNetObjects, this));

        this.sendRootGamePacket(new GameDataPacket([connection.player.gameObject.spawn()]), sendTo);
        break;
    }
  }

  private handleDespawn(netId: number, sendTo?: Connection[]) {
    let innerNetObject = this.findInnerNetObject(netId);

    if (!innerNetObject)
      throw new Error("Attempted to despawn an unknown InnerNetObject: " + netId);

    let entity: Entity;

    switch (innerNetObject.parent.type) {
      case SpawnType.AprilShipStatus:
      case SpawnType.Headquarters:
      case SpawnType.ShipStatus:
      case SpawnType.PlanetMap:
        entity = this.shipStatus!;
        break;
      case SpawnType.GameData:
        entity = this.gameData!;
        break;
      case SpawnType.LobbyBehaviour:
        entity = this.lobbyBehavior!;
        break;
      case SpawnType.MeetingHud:
        entity = this.meetingHud!;
        break;
      case SpawnType.PlayerControl:
        this.connections.forEach(connection => {
          if (connection.player) {
            switch (netId) {
              case connection.player.gameObject.playerControl.id:
                return connection.player.gameObject.playerControl;
              case connection.player.gameObject.playerPhysics.id:
                return connection.player.gameObject.playerPhysics;
              case connection.player.gameObject.customNetworkTransform.id:
                return connection.player.gameObject.customNetworkTransform;
            }
          }
        });
        return;
    }

    delete entity.innerNetObjects[
      entity.innerNetObjects.findIndex(ino => ino.id == netId)
    ];

    this.sendRootGamePacket(
      new GameDataPacket(
        [new DespawnPacket(innerNetObject.id)],
        this.code,
      ),
      sendTo,
    );
  }

  private handleAlterGameTag(tag: AlterGameTag, value: number, sendTo?: Connection[]) {
    this.sendRootGamePacket(new AlterGameTagPacket(this.code, tag, value), sendTo);
  }

  private handleEndGame(reason: GameOverReason, showAd: boolean, sendTo?: Connection[]) {
    this.sendRootGamePacket(new EndGamePacket(this.code, reason, showAd), sendTo);
  }

  private handleRemoveGame(reason?: DisconnectReason, sendTo?: Connection[]) {
    this.sendRootGamePacket(new RemoveGamePacket(reason), sendTo);
  }

  private handleStartGame(sendTo?: Connection[]) {
    this.sendRootGamePacket(new StartGamePacket(this.code), sendTo);
  }

  private handleRemovePlayer(removedClientId: number, hostClientId: number, disconnectReason?: DisconnectReason, sendTo?: Connection[]) {
    this.sendRootGamePacket(
      new RemovePlayerPacket(this.code, removedClientId, hostClientId, disconnectReason), 
      sendTo,
    );
  }
};
