import { JoinGameErrorPacket, JoinGameRequestPacket } from "../protocol/packets/rootGamePackets/joinGame";
import { GetGameListResponsePacket, RoomListing } from "../protocol/packets/rootGamePackets/getGameList";
import { RootGamePacketDataType } from "../protocol/packets/packetTypes/genericPacket";
import { HostGameResponsePacket } from "../protocol/packets/rootGamePackets/hostGame";
import { PacketDestination, RootGamePacketType } from "../protocol/packets/types";
import { DisconnectionType, DisconnectReason } from "../types/disconnectReason";
import { BaseRootGamePacket } from "../protocol/packets/basePacket";
import { DEFAULT_SERVER_PORT } from "../util/constants";
import { Connection } from "../protocol/connection";
import { RemoteInfo } from "../util/remoteInfo";
import { Level } from "../types/level";
import { Room } from "../room";
import dgram from "dgram";

export enum DefaultHostState {
  Server,
  Client,
}

export interface ServerConfig {
  defaultHost: DefaultHostState;
  defaultRoomAddress: string;
  defaultRoomPort: number;
}

const DEFAULT_SERVER_CONFIG: ServerConfig = {
  defaultHost: DefaultHostState.Server,
  defaultRoomAddress: "0.0.0.0",
  defaultRoomPort: DEFAULT_SERVER_PORT,
};

export class Server {
  public readonly serverSocket: dgram.Socket;
  public readonly connections: Map<string, Connection> = new Map();
  public readonly connectionRoomMap: Map<string, Room> = new Map();
  // TODO: Store rooms as just a Map of code to room?
  public rooms: Room[] = [];
  public roomMap: Map<string, Room> = new Map();

  // Starts at 1 to allow the Server host implementation's ID to be 0
  private connectionIndex = 1;

  constructor(
    public config: ServerConfig = DEFAULT_SERVER_CONFIG,
  ) {
    this.serverSocket = dgram.createSocket("udp4");

    this.serverSocket.on("message", (buf, remoteInfo) => {
      const sender = this.getConnection(remoteInfo);

      sender.emit("message", buf);
    });
  }

  async listen(port: number = DEFAULT_SERVER_PORT): Promise<void> {
    return new Promise(resolve => {
      this.serverSocket.bind(port, "0.0.0.0", resolve);
    });
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

    newConnection.id = this.connectionIndex++;

    newConnection.on("packet", (evt: RootGamePacketDataType) => this.handlePacket(evt, newConnection));

    newConnection.on("disconnected", (reason?: DisconnectReason) => {
      this.handleDisconnection(newConnection, reason);
    });

    return newConnection;
  }

  private handlePacket(packet: BaseRootGamePacket, sender: Connection): void {
    switch (packet.type) {
      case RootGamePacketType.HostGame: {
        const newRoom = new Room(this.config.defaultRoomAddress, this.config.defaultRoomPort, this.config.defaultHost == DefaultHostState.Server);

        this.rooms.push(newRoom);
        this.roomMap.set(newRoom.code, newRoom);

        sender.send([ new HostGameResponsePacket(newRoom.code) ]);
        break;
      }
      case RootGamePacketType.JoinGame: {
        const room = this.roomMap.get((packet as JoinGameRequestPacket).roomCode);

        if (room) {
          this.connectionRoomMap.set(RemoteInfo.toString(sender), room);

          room.handleJoin(sender);
        } else {
          sender.send([ new JoinGameErrorPacket(DisconnectionType.GameNotFound) ]);
        }
        break;
      }
      case RootGamePacketType.GetGameList: {
        const results: RoomListing[] = [];
        const counts: [number, number, number] = [0, 0, 0];

        for (let i = 0; i < this.rooms.length; i++) {
          const room = this.rooms[i];

          // TODO: Add config option to include private games
          if (!room.isPublic) {
            continue;
          }

          counts[room.options.options.levels[0]]++;

          // TODO: Make results size configurable
          if (results.length < 10) {
            results[i] = room.roomListing;
          }
        }

        sender.send([ new GetGameListResponsePacket(results, counts[Level.TheSkeld], counts[Level.MiraHq], counts[Level.Polus]) ]);
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
