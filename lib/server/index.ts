import { GetGameListResponsePacket, RoomListing } from "../protocol/packets/rootGamePackets/getGameList";
import { RootGamePacketDataType } from "../protocol/packets/packetTypes/genericPacket";
import { HostGameResponsePacket } from "../protocol/packets/rootGamePackets/hostGame";
import { JoinGameErrorPacket, JoinGameRequestPacket } from "../protocol/packets/rootGamePackets/joinGame";
import { PacketDestination, RootGamePacketType } from "../protocol/packets/types";
import { BaseRootGamePacket } from "../protocol/packets/basePacket";
import { DEFAULT_SERVER_PORT } from "../util/constants";
import { Connection } from "../protocol/connection";
import { RemoteInfo } from "../util/remoteInfo";
import { Level } from "../types/level";
import { Room } from "../room";
import dgram from "dgram";
import { DisconnectionType, DisconnectReason } from "../types/disconnectReason";

enum DefaultHostState {
  Server,
  Client,
}

interface ServerConfig {
  defaultHost: DefaultHostState;
  defaultRoomAddress: string;
  defaultRoomPort: number;
}

const DEFAULT_SERVER_CONFIG: ServerConfig = {
  defaultHost: DefaultHostState.Client,
  defaultRoomAddress: "0.0.0.0",
  defaultRoomPort: DEFAULT_SERVER_PORT,
};

export class Server {
  public serverSocket: dgram.Socket;
  public connections: Map<string, Connection> = new Map();
  public connectionRoomMap: Map<string, Room> = new Map();
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
        delete this.rooms[this.rooms.indexOf(connection.room)];
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

          // throw new Error(`Client ${sender.id} sent a JoinGame packet with an invalid room`);
        }
        break;
      }
      case RootGamePacketType.GetGameList: {
        const rooms: RoomListing[] = [];
        const counts: [number, number, number] = [0, 0, 0];

        for (let i = 0; i < this.rooms.length; i++) {
          const room = this.rooms[i];

          counts[room.options.options.levels[0]]++;

          // TODO: Filter pog?
          rooms[i] = room.roomListing;
        }

        sender.send([ new GetGameListResponsePacket(rooms, counts[Level.TheSkeld], counts[Level.MiraHq], counts[Level.Polus]) ]);
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
