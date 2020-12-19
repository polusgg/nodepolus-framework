import { GameListCounts, GetGameListResponsePacket, LobbyListing } from "../protocol/packets/rootGamePackets/getGameList";
import { DEFAULT_HOST_STATE, DEFAULT_SERVER_ADDRESS, DEFAULT_SERVER_PORT, MaxValue } from "../util/constants";
import { HostGameResponsePacket, HostGameRequestPacket } from "../protocol/packets/rootGamePackets/hostGame";
import { JoinGameErrorPacket, JoinGameRequestPacket } from "../protocol/packets/rootGamePackets/joinGame";
import { RootGamePacketDataType } from "../protocol/packets/packetTypes/genericPacket";
import { PacketDestination, RootGamePacketType } from "../protocol/packets/types";
import { DisconnectionType, DisconnectReason } from "../types/disconnectReason";
import { DefaultHostState, ServerConfig } from "../api/server/serverConfig";
import { BaseRootGamePacket } from "../protocol/packets/basePacket";
import { RoomCreatedEvent } from "../api/events/server/roomCreated";
import { FakeClientId } from "../types/fakeClientId";
import { Connection } from "../protocol/connection";
import { RemoteInfo } from "../util/remoteInfo";
import { Room as ApiRoom } from "../api/room";
import { RoomCode } from "../util/roomCode";
import Emittery from "emittery";
import { Room } from "../room";
import dgram from "dgram";

export type ServerEvents = {
  roomCreated: RoomCreatedEvent;
};

export class Server extends Emittery.Typed<ServerEvents> {
  public readonly startedAt = Date.now();
  public readonly serverSocket: dgram.Socket;
  public readonly connections: Map<string, Connection> = new Map();
  public readonly connectionRoomMap: Map<string, Room> = new Map();

  public rooms: Room[] = [];
  public roomMap: Map<string, Room> = new Map();

  // Starts at 1 to allow the Server host implementation's ID to be 0
  private connectionIndex = Object.keys(FakeClientId).length / 2;

  get nextConnectionId(): number {
    if (++this.connectionIndex > MaxValue.UInt32) {
      this.connectionIndex = 1;
    }

    return this.connectionIndex;
  }

  get address(): string {
    return this.config.serverAddress ?? DEFAULT_SERVER_ADDRESS;
  }

  get port(): number {
    return this.config.serverPort ?? DEFAULT_SERVER_PORT;
  }

  get defaultHost(): DefaultHostState {
    return this.config.defaultHost ?? DEFAULT_HOST_STATE;
  }

  get defaultRoomAddress(): string {
    return this.config.defaultRoomAddress ?? this.address;
  }

  get defaultRoomPort(): number {
    return this.config.defaultRoomPort ?? this.port;
  }

  constructor(
    public config: ServerConfig = {},
  ) {
    super();

    this.serverSocket = dgram.createSocket("udp4");

    this.serverSocket.on("message", (buf, remoteInfo) => {
      const sender = this.getConnection(remoteInfo);

      sender.emit("message", buf);
    });
  }

  listen(onStart?: () => void): void {
    this.serverSocket.bind(this.port, this.address, onStart);
  }

  getConnection(remoteInfo: string | dgram.RemoteInfo): Connection {
    if (typeof remoteInfo != "string") {
      remoteInfo = RemoteInfo.toString(remoteInfo);
    }

    let connection = this.connections.get(remoteInfo);

    if (connection) {
      return connection;
    }

    connection = this.initializeConnection(RemoteInfo.fromString(remoteInfo));

    this.connections.set(remoteInfo, connection);

    return connection;
  }

  private handleDisconnection(connection: Connection, reason?: DisconnectReason): void {
    if (connection.room) {
      connection.room.handleDisconnect(connection, reason);
      this.connectionRoomMap.delete(RemoteInfo.toString(connection));

      if (connection.room.connections.length == 0) {
        this.rooms.splice(this.rooms.indexOf(connection.room), 1);
        this.roomMap.delete(connection.room.code);
      }
    }

    this.connections.delete(RemoteInfo.toString(connection));
  }

  private initializeConnection(remoteInfo: dgram.RemoteInfo): Connection {
    const newConnection = new Connection(remoteInfo, this.serverSocket, PacketDestination.Client);

    newConnection.id = this.nextConnectionId;

    newConnection.on("packet", (evt: RootGamePacketDataType) => this.handlePacket(evt, newConnection));
    newConnection.on("disconnected", (reason?: DisconnectReason) => {
      this.handleDisconnection(newConnection, reason);
    });

    return newConnection;
  }

  private handlePacket(packet: BaseRootGamePacket, sender: Connection): void {
    switch (packet.type) {
      case RootGamePacketType.HostGame: {
        let roomCode = RoomCode.generate();

        while (this.roomMap.has(roomCode)) {
          roomCode = RoomCode.generate();
        }

        const newRoom = new Room(
          this.defaultRoomAddress,
          this.defaultRoomPort,
          this.defaultHost == DefaultHostState.Server,
          roomCode,
        );

        newRoom.options = (packet as HostGameRequestPacket).options;

        const event = new RoomCreatedEvent(new ApiRoom(newRoom));

        this.emit("roomCreated", event);

        if (!event.isCancelled) {
          this.rooms.push(newRoom);
          this.roomMap.set(newRoom.code, newRoom);

          sender.sendReliable([new HostGameResponsePacket(newRoom.code)]);
        } else {
          sender.disconnect(DisconnectReason.custom("The server refused to create your game"));
        }
        break;
      }
      case RootGamePacketType.JoinGame: {
        const room = this.roomMap.get((packet as JoinGameRequestPacket).roomCode);

        if (room) {
          this.connectionRoomMap.set(RemoteInfo.toString(sender), room);

          room.handleJoin(sender);
        } else {
          sender.sendReliable([new JoinGameErrorPacket(DisconnectionType.GameNotFound)]);
        }
        break;
      }
      case RootGamePacketType.GetGameList: {
        const results: LobbyListing[] = [];
        const counts = new GameListCounts();

        for (let i = 0; i < this.rooms.length; i++) {
          const room = this.rooms[i];
          const level: number = room.options.options.levels[0];

          // TODO: Add config option to include private games
          if (!room.isPublic) {
            continue;
          }

          counts.increment(level);

          // TODO: Add config option for max player count and max results
          if (room.lobbyListing.playerCount < 10 && results.length < 10) {
            results[i] = room.lobbyListing;
          }
        }

        results.sort((a, b) => b.playerCount - a.playerCount);

        sender.sendReliable([new GetGameListResponsePacket(results, counts)]);
        break;
      }
      default: {
        const room = this.connectionRoomMap.get(RemoteInfo.toString(sender));

        if (!room) {
          throw new Error(`Client ${sender.id} sent root game packet type ${packet.type} (${RootGamePacketType[packet.type]}) while not in a room`);
        }
      }
    }
  }
}
