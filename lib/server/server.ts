import { ServerLobbyCreatedEvent, ServerLobbyDestroyedEvent, ServerLobbyJoinEvent, ServerLobbyListEvent } from "../api/events/server";
import { DEFAULT_MAX_PLAYERS, DEFAULT_SERVER_ADDRESS, DEFAULT_SERVER_PORT, MaxValue } from "../util/constants";
import { PlayerBannedEvent, PlayerKickedEvent, PlayerLeftEvent } from "../api/events/player";
import { ConnectionClosedEvent, ConnectionOpenedEvent } from "../api/events/connection";
import { PacketDestination, RootPacketType } from "../protocol/packets/types/enums";
import { LobbyCount, LobbyListing } from "../protocol/packets/root/types";
import { DisconnectReasonType, FakeClientId } from "../types/enums";
import { BasicServerEvents, ServerEvents } from "../api/events";
import { ConnectionInfo, DisconnectReason } from "../types";
import { Connection } from "../protocol/connection";
import { LobbyCode } from "../util/lobbyCode";
import { ServerConfig } from "../api/config";
import { LobbyInstance } from "../api/lobby";
import { InternalLobby } from "../lobby";
import { Logger } from "../logger";
import Emittery from "emittery";
import dgram from "dgram";
import {
  BaseRootPacket,
  GetGameListRequestPacket,
  GetGameListResponsePacket,
  HostGameRequestPacket,
  HostGameResponsePacket,
  JoinGameErrorPacket,
  JoinGameRequestPacket,
} from "../protocol/packets/root";

export class Server extends Emittery.Typed<ServerEvents, BasicServerEvents> {
  private readonly startedAt = Date.now();
  private readonly serverSocket = dgram.createSocket("udp4");
  private readonly logger: Logger;
  private readonly connections: Map<string, Connection> = new Map();
  private readonly lobbies: LobbyInstance[] = [];
  private readonly lobbyMap: Map<string, LobbyInstance> = new Map();

  // Reserve the fake client IDs
  private connectionIndex = Object.keys(FakeClientId).length / 2;

  constructor(
    private readonly config: ServerConfig = {},
  ) {
    super();

    this.logger = new Logger(
      "Server",
      [process.env.NP_LOG_LEVEL, this.config.logging?.level].find(Logger.isValidLevel) ?? "info",
      this.config.logging?.filename ?? "server.log",
      this.config.logging?.maxFileSizeInBytes ?? 104857600,
      this.config.logging?.maxFiles ?? 10,
    );

    this.serverSocket.on("message", (buf, remoteInfo) => {
      this.getConnection(ConnectionInfo.fromString(`${remoteInfo.address}:${remoteInfo.port}`)).emit("message", buf);
    });

    this.serverSocket.on("error", error => {
      this.logger.catch(error);
    });
  }

  getConfig(): ServerConfig {
    return this.config;
  }

  getAddress(): string {
    return this.config.serverAddress ?? DEFAULT_SERVER_ADDRESS;
  }

  getPort(): number {
    return this.config.serverPort ?? DEFAULT_SERVER_PORT;
  }

  getDefaultLobbyAddress(): string {
    return this.config.lobby?.defaultAddress ?? this.getAddress();
  }

  getDefaultLobbyPort(): number {
    return this.config.lobby?.defaultPort ?? this.getPort();
  }

  getMaxPlayersPerLobby(): number {
    return this.config.lobby?.maxPlayers ?? DEFAULT_MAX_PLAYERS;
  }

  getStartedAt(): number {
    return this.startedAt;
  }

  getSocket(): dgram.Socket {
    return this.serverSocket;
  }

  getLogger(childName?: string): Logger {
    return childName === undefined ? this.logger : this.logger.child(childName);
  }

  getConnections(): ReadonlyMap<string, Connection> {
    return this.connections;
  }

  getConnection(connectionInfo: string | ConnectionInfo): Connection {
    let info: ConnectionInfo;
    let identifier: string;

    if (typeof connectionInfo != "string") {
      info = connectionInfo;
      identifier = info.toString();
    } else {
      info = ConnectionInfo.fromString(connectionInfo);
      identifier = connectionInfo;
    }

    let connection = this.connections.get(identifier);

    if (connection) {
      return connection;
    }

    connection = this.initializeConnection(info);

    this.connections.set(identifier, connection);

    return connection;
  }

  getLobbies(): readonly LobbyInstance[] {
    return this.lobbies;
  }

  getLobby(code: string): LobbyInstance | undefined {
    return this.lobbyMap.get(code);
  }

  addLobby(lobby: LobbyInstance): void {
    this.lobbies.push(lobby);
    this.lobbyMap.set(lobby.getCode(), lobby);
  }

  deleteLobby(lobby: LobbyInstance): void {
    this.lobbies.splice(this.lobbies.indexOf(lobby), 1);
    this.lobbyMap.delete(lobby.getCode());
  }

  getNextConnectionId(): number {
    if (++this.connectionIndex > MaxValue.UInt32) {
      this.connectionIndex = Object.keys(FakeClientId).length / 2;
    }

    return this.connectionIndex;
  }

  async listen(): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.serverSocket.bind(this.getPort(), this.getAddress(), () => {
        this.emit("server.ready");

        resolve();
      });
    });
  }

  private async handleDisconnect(connection: Connection, reason?: DisconnectReason): Promise<void> {
    if (connection.lobby) {
      this.getLogger().verbose("Connection %s disconnected from lobby %s", connection, connection.lobby);

      const player = connection.lobby.findPlayerByConnection(connection);

      if (player) {
        this.emit("player.left", new PlayerLeftEvent(connection.lobby, player));
      }

      connection.lobby.handleDisconnect(connection, reason);

      if (connection.lobby.getConnections().length == 0) {
        this.getLogger().verbose("Destroying lobby %s", connection.lobby);

        const event = new ServerLobbyDestroyedEvent(connection.lobby);

        await this.emit("server.lobby.destroyed", event);

        if (event.isCancelled()) {
          this.getLogger().verbose("Cancelled destroying lobby %s", connection.lobby);

          return;
        }

        this.getLogger().verbose("Destroyed lobby %s", connection.lobby);

        this.deleteLobby(connection.lobby);
      }
    } else {
      this.getLogger().verbose("Connection %s disconnected", connection);
    }

    this.connections.delete(connection.getConnectionInfo().toString());
  }

  private initializeConnection(connectionInfo: ConnectionInfo): Connection {
    const newConnection = new Connection(connectionInfo, this.serverSocket, PacketDestination.Client);

    newConnection.id = this.getNextConnectionId();

    this.getLogger().verbose("Initialized connection %s", newConnection);

    newConnection.on("packet", async (packet: BaseRootPacket) => this.handlePacket(packet, newConnection));
    newConnection.once("disconnected").then((reason?: DisconnectReason) => {
      this.emit("connection.closed", new ConnectionClosedEvent(newConnection, reason));
      this.handleDisconnect(newConnection, reason);
    });
    newConnection.once("kicked").then(({ isBanned, kickingPlayer, reason }) => {
      if (!newConnection.lobby) {
        return;
      }

      const lobby = newConnection.lobby;
      const player = lobby.findPlayerByConnection(newConnection);

      if (!player) {
        return;
      }

      if (isBanned) {
        this.emit("player.banned", new PlayerBannedEvent(lobby, player, kickingPlayer, reason));
      } else {
        this.emit("player.kicked", new PlayerKickedEvent(lobby, player, kickingPlayer, reason));
      }
    });
    newConnection.once("hello").then(async () => {
      const event = new ConnectionOpenedEvent(newConnection);

      await this.emit("connection.opened", event);

      if (event.isCancelled()) {
        newConnection.disconnect(event.getDisconnectReason());
      }
    });

    return newConnection;
  }

  private async handlePacket(packet: BaseRootPacket, sender: Connection): Promise<void> {
    switch (packet.type) {
      case RootPacketType.HostGame: {
        this.getLogger().verbose("Connection %s trying to host lobby", sender);

        let lobbyCode = LobbyCode.generate();

        while (this.lobbyMap.has(lobbyCode)) {
          lobbyCode = LobbyCode.generate();
        }

        const newLobby = new InternalLobby(
          this,
          this.getDefaultLobbyAddress(),
          this.getDefaultLobbyPort(),
          (packet as HostGameRequestPacket).options,
          lobbyCode,
        );
        const event = new ServerLobbyCreatedEvent(sender, newLobby);

        await this.emit("server.lobby.created", event);

        if (!event.isCancelled()) {
          this.getLogger().verbose("Connection %s hosting lobby %s", sender, newLobby);

          this.addLobby(newLobby);

          sender.sendReliable([new HostGameResponsePacket(newLobby.getCode())]);
        } else {
          this.getLogger().verbose("Cancelled connection %s hosting lobby", sender);

          sender.disconnect(event.getDisconnectReason());
        }
        break;
      }
      case RootPacketType.JoinGame: {
        const lobbyCode = (packet as JoinGameRequestPacket).lobbyCode;
        const event = new ServerLobbyJoinEvent(sender, lobbyCode, this.lobbyMap.get(lobbyCode));

        await this.emit("server.lobby.join", event);

        if (!event.isCancelled()) {
          if (event.getLobby()) {
            (event.getLobby() as InternalLobby).handleJoin(sender);
          } else {
            sender.sendReliable([new JoinGameErrorPacket(DisconnectReasonType.GameNotFound)]);
          }
        } else {
          sender.sendReliable([new JoinGameErrorPacket(event.getDisconnectReason())]);
        }
        break;
      }
      case RootPacketType.GetGameList: {
        const results: LobbyListing[] = [];
        const counts = new LobbyCount();

        // TODO: Sort by playerCount in descending order
        for (let i = 0; i < this.lobbies.length; i++) {
          const lobby = this.lobbies[i];
          const level: number = lobby.getLevel();

          if (!lobby.isPublic()) {
            continue;
          }

          counts.increment(level);

          const listing = lobby.getLobbyListing();

          if (!listing.isFull() && results.length < 10) {
            results[i] = listing;
          }
        }

        results.sort((a, b) => b.getPlayerCount() - a.getPlayerCount());

        const event = new ServerLobbyListEvent(sender, (packet as GetGameListRequestPacket).includePrivate, results, counts);

        await this.emit("server.lobby.list", event);

        if (!event.isCancelled()) {
          this.getLogger().verbose("Sending game list to connection %s", sender);

          sender.sendReliable([new GetGameListResponsePacket(event.getLobbies(), event.getLobbyCounts())]);
        } else {
          sender.disconnect(event.getDisconnectReason());
        }
        break;
      }
      default: {
        if (!sender.lobby) {
          throw new Error(`Client ${sender.id} sent root game packet type ${packet.type} (${RootPacketType[packet.type]}) while not in a lobby`);
        }
      }
    }
  }
}
