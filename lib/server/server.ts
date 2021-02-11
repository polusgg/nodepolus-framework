import { ConnectionInfo, DisconnectReason, InboundPacketTransformer, OutboundPacketTransformer } from "../types";
import { PlayerBannedEvent, PlayerKickedEvent, PlayerLeftEvent } from "../api/events/player";
import { ConnectionClosedEvent, ConnectionOpenedEvent } from "../api/events/connection";
import { PacketDestination, RootPacketType } from "../protocol/packets/types/enums";
import { LobbyCount, LobbyListing } from "../protocol/packets/root/types";
import { DisconnectReasonType, FakeClientId } from "../types/enums";
import { BasicServerEvents, ServerEvents } from "../api/events";
import { DEFAULT_CONFIG, MaxValue } from "../util/constants";
import { RootPacket } from "../protocol/packets/hazel";
import { MessageReader } from "../util/hazelMessage";
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
import {
  ServerLobbyCreatedEvent,
  ServerLobbyCreatedRefusedEvent,
  ServerLobbyDestroyedEvent,
  ServerLobbyJoinEvent,
  ServerLobbyListEvent,
  ServerPacketCustomEvent,
} from "../api/events/server";

export class Server extends Emittery.Typed<ServerEvents, BasicServerEvents> {
  private readonly startedAt = Date.now();
  private readonly serverSocket = dgram.createSocket("udp4");
  private readonly logger: Logger;
  private readonly connections: Map<string, Connection> = new Map();
  private readonly lobbies: LobbyInstance[] = [];
  private readonly lobbyMap: Map<string, LobbyInstance> = new Map();

  // Reserve the fake client IDs
  private connectionIndex = Object.keys(FakeClientId).length / 2;
  private listening = false;
  private inboundPacketTransformer?: InboundPacketTransformer;
  private outboundPacketTransformer?: OutboundPacketTransformer;

  /**
   * @param config The server configuration
   */
  constructor(
    private readonly config: ServerConfig = {},
  ) {
    super();

    this.logger = new Logger(
      "Server",
      [process.env.NP_LOG_LEVEL, this.config.logging?.level].find(Logger.isValidLevel) ?? DEFAULT_CONFIG.logging.level,
      this.config.logging?.filename ?? DEFAULT_CONFIG.logging.filename,
      this.config.logging?.maxFileSizeInBytes ?? DEFAULT_CONFIG.logging.maxFileSizeInBytes,
      this.config.logging?.maxFiles ?? DEFAULT_CONFIG.logging.maxFiles,
    );

    this.serverSocket.on("message", (buffer, remoteInfo) => {
      if (!this.listening) {
        return;
      }

      const connection = this.getConnection(ConnectionInfo.fromString(`${remoteInfo.address}:${remoteInfo.port}`));
      const reader = MessageReader.fromRawBytes(buffer);

      connection.emit(
        "message",
        this.inboundPacketTransformer !== undefined ? this.inboundPacketTransformer(connection, reader) : reader,
      );
    });

    this.serverSocket.on("error", error => {
      this.logger.catch(error);
    });

    if (this.getMaxPlayersPerLobby() > 10) {
      this.logger.warn("Lobbies with more than 10 players is experimental");
    }
  }

  /**
   * Gets the function used to transform incoming packets.
   */
  getInboundPacketTransformer(): InboundPacketTransformer | undefined {
    return this.inboundPacketTransformer;
  }

  /**
   * Sets the function used to transform incoming packets.
   *
   * @param inboundPacketTransformer The function used to transform incoming packets
   */
  setInboundPacketTransformer(inboundPacketTransformer: InboundPacketTransformer): void {
    this.inboundPacketTransformer = inboundPacketTransformer;
  }

  /**
   * Gets the function used to transform outgoing packets.
   */
  getOutboundPacketTransformer(): OutboundPacketTransformer | undefined {
    return this.outboundPacketTransformer;
  }

  /**
   * Sets the function used to transform outgoing packets.
   *
   * @param inboundPacketTransformer The function used to transform outgoing packets
   */
  setOutboundPacketTransformer(outboundPacketTransformer: OutboundPacketTransformer): void {
    this.outboundPacketTransformer = outboundPacketTransformer;
  }

  /**
   * Gets the elapsed time, in milliseconds, since the Unix epoch at which the
   * server was started.
   */
  getStartedAt(): number {
    return this.startedAt;
  }

  /**
   * Gets the underlying socket for the server.
   */
  getSocket(): dgram.Socket {
    return this.serverSocket;
  }

  /**
   * Gets the server's logger, or a child logger with the given name.
   *
   * @param childName The name of the child logger
   * @returns The server's logger, or a child logger using `childName` for the name
   */
  getLogger(childName?: string): Logger {
    return childName === undefined ? this.logger : this.logger.child(childName);
  }

  /**
   * Gets all of the connections connected to the server.
   */
  getConnections(): ReadonlyMap<string, Connection> {
    return this.connections;
  }

  /**
   * Gets or creates a connection from the given ConnectionInfo.
   *
   * @param connectionInfo The ConnectionInfo describing the connection that will be returned
   * @returns A connection described by `connectionInfo`
   */
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

  /**
   * Gets all lobbies hosted on the server.
   */
  getLobbies(): readonly LobbyInstance[] {
    return this.lobbies;
  }

  /**
   * Gets the lobby with the given code.
   *
   * @param code The code for the lobby that will be returned
   * @returns The lobby, or `undefined` if no lobbies on the server have the code `code`
   */
  getLobby(code: string): LobbyInstance | undefined {
    return this.lobbyMap.get(code);
  }

  /**
   * Adds the given lobby to the server.
   *
   * @param lobby The lobby to be added
   */
  addLobby(lobby: LobbyInstance): void {
    if (this.lobbyMap.has(lobby.getCode())) {
      throw new Error(`A lobby with the code ${lobby.getCode()} already exists`);
    }

    this.lobbies.push(lobby);
    this.lobbyMap.set(lobby.getCode(), lobby);
  }

  /**
   * Removes the given lobby from the server.
   *
   * @param lobby The lobby to be removed
   */
  deleteLobby(lobby: LobbyInstance): void {
    if (lobby instanceof InternalLobby) {
      (lobby as InternalLobby).cancelJoinTimer();
      (lobby as InternalLobby).cancelStartTimer();
    }

    this.lobbies.splice(this.lobbies.indexOf(lobby), 1);
    this.lobbyMap.delete(lobby.getCode());
  }

  /**
   * Gets the server configuration.
   */
  getConfig(): ServerConfig {
    return this.config;
  }

  /**
   * Gets the IP address to which the server is bound.
   */
  getAddress(): string {
    return this.config.serverAddress ?? DEFAULT_CONFIG.serverAddress;
  }

  /**
   * Gets the port on which the server listens for packets.
   */
  getPort(): number {
    return this.config.serverPort ?? DEFAULT_CONFIG.serverPort;
  }

  /**
   * Gets the maximum number of lobbies that the server will host at a time.
   */
  getMaxLobbies(): number {
    return this.config.maxLobbies ?? DEFAULT_CONFIG.maxLobbies;
  }

  /**
   * Gets the maximum number of connections allowed per IP address.
   */
  getMaxConnectionsPerAddress(): number {
    return this.config.maxConnectionsPerAddress ?? DEFAULT_CONFIG.maxConnectionsPerAddress;
  }

  /**
   * Gets the default IP address to which a lobby hosted by the server is bound.
   */
  getDefaultLobbyAddress(): string {
    return this.config.lobby?.defaultAddress ?? DEFAULT_CONFIG.lobby.defaultAddress;
  }

  /**
   * Gets the default port on which a lobby hosted by the server listens for
   * packets.
   */
  getDefaultLobbyPort(): number {
    return this.config.lobby?.defaultPort ?? DEFAULT_CONFIG.lobby.defaultPort;
  }

  /**
   * Gets the default time, in seconds, until the game starts after a host
   * clicks the Play button in a lobby.
   */
  getDefaultLobbyStartTimerDuration(): number {
    return this.config.lobby?.defaultStartTimerDuration ?? DEFAULT_CONFIG.lobby.defaultStartTimerDuration;
  }

  /**
   * Gets the default time, in seconds, before a lobby is automatically closed
   * if no players have joined.
   */
  getDefaultLobbyTimeToJoinUntilClosed(): number {
    return this.config.lobby?.defaultTimeToJoinUntilClosed ?? DEFAULT_CONFIG.lobby.defaultTimeToJoinUntilClosed;
  }

  /**
   * Gets the default time, in seconds, before a lobby is automatically closed
   * if a game has not been started.
   */
  getDefaultLobbyTimeToStartUntilClosed(): number {
    return this.config.lobby?.defaultTimeToStartUntilClosed ?? DEFAULT_CONFIG.lobby.defaultTimeToStartUntilClosed;
  }

  /**
   * Gets the maximum number of players that the server will allow in a lobby.
   */
  getMaxPlayersPerLobby(): number {
    return this.config.lobby?.maxPlayers ?? DEFAULT_CONFIG.lobby.maxPlayers;
  }

  /**
   * Gets the next available client ID.
   */
  getNextConnectionId(): number {
    if (++this.connectionIndex > MaxValue.UInt32) {
      this.connectionIndex = Object.keys(FakeClientId).length / 2;
    }

    return this.connectionIndex;
  }

  /**
   * Starts listening for packets on the server socket.
   */
  async listen(): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.serverSocket.bind(this.getPort(), this.getAddress(), () => {
        this.listening = true;
        this.emit("server.ready");

        resolve();
      });
    });
  }

  /**
   * Stops listening for packets on the server socket, disconnects all
   * connections, and removes all lobbies.
   */
  async close(): Promise<void> {
    this.listening = false;

    this.connections.forEach(async connection => connection.sendReliable([new JoinGameErrorPacket(DisconnectReason.custom("The server is shutting down"))]));
    this.lobbies.splice(0, this.lobbies.length);
    this.lobbyMap.clear();

    await this.emit("server.close");
  }

  /**
   * Cleans up the given disconnecting connection and removes empty lobbies.
   *
   * @param connection The connection that was disconnected
   * @param reason The reason for why the connection was disconnected
   */
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

  /**
   * Creates a new connection from the given ConnectionInfo.
   *
   * @param connectionInfo The ConnectionInfo describing the connection
   * @returns A new connection described by `connectionInfo`
   */
  private initializeConnection(connectionInfo: ConnectionInfo): Connection {
    const newConnection = new Connection(
      connectionInfo,
      this.serverSocket,
      PacketDestination.Client,
      (): OutboundPacketTransformer | undefined => this.getOutboundPacketTransformer(),
    );

    newConnection.id = this.getNextConnectionId();

    this.getLogger().verbose("Initialized connection %s", newConnection);

    newConnection.on("packet", (packet: BaseRootPacket) => {
      if (!packet.isCancelled) {
        this.handlePacket(packet, newConnection);
      }
    });

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

  /**
   * Called when the server receives a packet from a connection.
   *
   * @param packet The packet that was sent to the server
   * @param sender The connection that sent the packet
   */
  private async handlePacket(packet: BaseRootPacket, sender: Connection): Promise<void> {
    switch (packet.type) {
      case RootPacketType.HostGame: {
        this.getLogger().verbose("Connection %s trying to host lobby", sender);

        if (this.lobbies.length >= this.getMaxLobbies()) {
          const event = new ServerLobbyCreatedRefusedEvent(sender);

          await this.emit("server.lobby.created.refused", event);

          if (!event.isCancelled()) {
            this.getLogger().verbose("Preventing connection %s from hosting lobby on full server", sender);

            sender.writeReliable(new JoinGameErrorPacket(event.getDisconnectReason()));

            return;
          }

          this.getLogger().verbose("Allowing connection %s to host lobby on full server", sender);
        }

        let lobbyCode = LobbyCode.generate();

        while (this.lobbyMap.has(lobbyCode)) {
          lobbyCode = LobbyCode.generate();
        }

        const newLobby = new InternalLobby(
          this,
          this.getDefaultLobbyAddress(),
          this.getDefaultLobbyPort(),
          this.getDefaultLobbyStartTimerDuration(),
          this.getDefaultLobbyTimeToJoinUntilClosed(),
          this.getDefaultLobbyTimeToStartUntilClosed(),
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
          this.getLogger().verbose("Prevented connection %s from hosting lobby", sender);

          sender.disconnect(event.getDisconnectReason());
        }
        break;
      }
      case RootPacketType.JoinGame: {
        const lobbyCode = (packet as JoinGameRequestPacket).lobbyCode;
        const event = new ServerLobbyJoinEvent(sender, lobbyCode, this.lobbyMap.get(lobbyCode));

        await this.emit("server.lobby.join", event);

        if (!event.isCancelled()) {
          const lobby = event.getLobby();

          if (lobby !== undefined) {
            const code = lobby.getCode();

            if (lobbyCode !== code) {
              sender.sendReliable([new HostGameResponsePacket(code)]);
            }

            (lobby as InternalLobby).handleJoin(sender);
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
        if (RootPacket.hasPacket(packet.type)) {
          if (!sender.lobby) {
            this.emit("server.packet.custom", new ServerPacketCustomEvent(sender, packet));
          }

          break;
        }

        if (!sender.lobby) {
          throw new Error(`Client ${sender.id} sent root game packet type ${packet.type} (${RootPacketType[packet.type]}) while not in a lobby`);
        }
      }
    }
  }
}
