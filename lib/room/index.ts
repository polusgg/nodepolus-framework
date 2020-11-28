import { SendLateRejectionPacket, RemovePlayerPacket } from "../protocol/packets/rootGamePackets/removePlayer";
import { GameDataPacket, GameDataPacketDataType } from "../protocol/packets/rootGamePackets/gameData";
import { SceneChangePacket } from "../protocol/packets/rootGamePackets/gameDataPackets/sceneChange";
import { RootGamePacketDataType } from "../protocol/packets/packetTypes/genericPacket";
import { WaitForHostPacket } from "../protocol/packets/rootGamePackets/waitForHost";
import { RootGamePacketType, GameDataPacketType } from "../protocol/packets/types";
import { AlterGameTagPacket } from "../protocol/packets/rootGamePackets/alterGame";
import { KickPlayerPacket } from "../protocol/packets/rootGamePackets/kickPlayer";
import { RemoveGamePacket } from "../protocol/packets/rootGamePackets/removeGame";
import { StartGamePacket } from "../protocol/packets/rootGamePackets/startGame";
import { EndGamePacket } from "../protocol/packets/rootGamePackets/endGame";
import { DisconnectReason } from "../types/disconnectReason";
import { GameOverReason } from "../types/gameOverReason";
import { AlterGameTag } from "../types/alterGameTag";
import { Connection } from "../protocol/connection";
import { HostInstance } from "../host/types";
import { RoomCode } from "../util/roomCode";
import Emittery from "emittery";
import { EntityHeadquarters } from "../protocol/entities/headquarters";
import { EntityPlanetMap } from "../protocol/entities/planetMap";
import { EntityShipStatus } from "../protocol/entities/shipStatus";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";

export type RoomEventTypes = {
  connectionJoin: Connection,
};

export class Room extends Emittery.Typed<RoomEventTypes> {
  public connections: Connection[] = [];

  public get players(): Player[] {
    return this.connections.map(con => con.player).filter(player => player);
  }

  private isHost: boolean = true;
  private customHostInstance?: CustomHost;
  private lobbyBehavior?: EntityLobbyBehavior;
  private gameData?: EntityGameData;
  private shipStatus?: EntityShipStatus | EntityHeadquarters | EntityPlanetMap;
  private meetingHud?: EntityMeetingHud;

  private findInnerNetObject(netId: number) {

  }

  private get host(): HostInstance {
    if (this.isHost) {
      if (this.customHostInstance) {
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
      con.on("packet", p => this.handlePacket(p, con));
    });
  }

  findConnection(id: number): Connection | undefined {
    return this.connections.find(con => con.id == id);
  }

  handlePacket(packet: RootGamePacketDataType, sender: Connection) {
    switch (packet.type) {
      case RootGamePacketType.AlterGame: {
        let data = (<AlterGameTagPacket>packet);

        this.broadcastAlterGame(data.tag, data.value);
        break;
      }
      case RootGamePacketType.EndGame: {
        let data = (<EndGamePacket>packet);

        this.broadcastEndGame(data.gameOverReason, data.showAd);
        break;
      }
      case RootGamePacketType.GameData:
      case RootGamePacketType.GameDataTo: {
        let gameData = <GameDataPacket>packet;
        let target: Connection | undefined;

        if (gameData.targetClientId) {
          target = this.findConnection(gameData.targetClientId);
        }

        gameData.packets.forEach(gameDataPacketInner => {
          this.handleGameDataPacket(gameDataPacketInner, sender, target);
        });
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
        this.broadcastRemoveGame((<RemoveGamePacket>packet).disconnectReason)
        break;
      }
      case RootGamePacketType.RemovePlayer: {
        if (!packet.clientBound) {
          let data = (<SendLateRejectionPacket>packet)
          let id = data.removedClientId;
          let con = this.findConnection(id);
          
          if (!con) {
            throw new Error("SendLateRejection sent for unknown connection: " + id);
          }

          con.sendLateRejection(data.disconnectReason);
        } else {
          let data = (<RemovePlayerPacket>packet);

          this.broadcastRemovePlayer(data.removedClientId, data.hostClientId, data.disconnectReason);
        }
        break;
      }
      case RootGamePacketType.StartGame: {
        this.broadcastStartGame()
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

  private handleGameDataPacket(packet: GameDataPacketDataType, sender: Connection, target?: Connection) {
    switch (packet.type) {
      case GameDataPacketType.Data: {
        //todo
      }
      case GameDataPacketType.Despawn: {
        this.despawn();
      }
      case GameDataPacketType.RPC: {
        //todo
      }
      case GameDataPacketType.Ready: {
        this.host.handleReady(sender);
        break;
      }
      case GameDataPacketType.SceneChange: {
        this.host.handleSceneChange(sender, (<SceneChangePacket>packet).scene);
        break;
      }
      case GameDataPacketType.Spawn: {
        this.spawn();
      }
      default:
        throw new Error("Unhandled game data packet type: " + packet.type);
    }
  }

  private broadcastAlterGame(tag: AlterGameTag, value: number) {
    this.connections.forEach(con => con.write(new AlterGameTagPacket(this.code, tag, value)));
  }

  private broadcastEndGame(reason: GameOverReason, showAd: boolean) {
    this.connections.forEach(con => con.write(new EndGamePacket(this.code, reason, showAd)));
  }

  private broadcastRemoveGame(reason?: DisconnectReason) {
    this.connections.forEach(con => con.write(new RemoveGamePacket(reason)));
  }

  private broadcastStartGame() {
    this.connections.forEach(con => con.write(new StartGamePacket(this.code)));
  }

  private broadcastRemovePlayer(removedClientId: number, hostClientId: number, disconnectReason?: DisconnectReason) {
    this.connections.forEach(con => con.write(
      new RemovePlayerPacket(this.code, removedClientId, hostClientId, disconnectReason))
    );
  }
};
