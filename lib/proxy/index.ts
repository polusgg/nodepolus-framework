import { LobbyImplementation, EntityLevel, InnerNetObject } from "../protocol/entities/types";
import { RPCPacket } from "../protocol/packets/rootGamePackets/gameDataPackets/rpc";
import { BaseRootGamePacket, BaseRPCPacket } from "../protocol/packets/basePacket";
import { GameDataPacket } from "../protocol/packets/rootGamePackets/gameData";
import { EntityMeetingHud } from "../protocol/entities/meetingHud";
import { EntityGameData } from "../protocol/entities/gameData";
import { PacketDestination } from "../protocol/packets/types";
import { GameOptionsData } from "../types/gameOptionsData";
import { DEFAULT_GAME_OPTIONS } from "../util/constants";
import { Connection } from "../protocol/connection";
import { GameState } from "../types/gameState";
import { HostInstance } from "../host/types";
import { ProxyInstance } from "./types";
import { Player } from "../player";
import Emittery from "emittery";
import dgram from "dgram";

export interface ProxyConfig {
  server: dgram.RemoteInfo;
}

export class ProxyLobby implements LobbyImplementation {
  public players: Player[] = [];
  public gameData?: EntityGameData;
  public shipStatus?: EntityLevel;
  public meetingHud?: EntityMeetingHud;
  public options: GameOptionsData = DEFAULT_GAME_OPTIONS;
  public customHostInstance: HostInstance;
  public gameState: GameState = GameState.NotStarted;

  constructor(
    private readonly proxy: Proxy,
    public isHost: boolean,
    public code: string,
  ) {}

  sendRPCPacket(from: InnerNetObject, packet: BaseRPCPacket, _sendTo?: (Player | HostInstance)[]): void {
    this.proxy.serverConnection.write(new GameDataPacket([
      new RPCPacket(from.id, packet),
    ], this.code));
  }
}

type ProxyEvents = {
  packetFromClient: BaseRootGamePacket;
  packetFromServer: BaseRootGamePacket;
};

export class Proxy extends Emittery.Typed<ProxyEvents> implements ProxyInstance {
  public readonly serverConnection: Connection;

  private readonly toServerSocket: dgram.Socket = dgram.createSocket("udp4");

  constructor(public config: ProxyConfig, public clientConnection: Connection) {
    super();

    this.serverConnection = new Connection(config.server, this.toServerSocket, PacketDestination.Server);

    this.toServerSocket.on("message", msg => {
      this.serverConnection.emit("message", msg);
    });

    this.serverConnection.on("packet", packet => {
      this.clientConnection.emit("packet", packet);
    });
  }
}
