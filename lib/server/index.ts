import { GetGameListResponsePacket, RoomListing } from "../protocol/packets/rootGamePackets/getGameList";
import { RootGamePacketDataType } from "../protocol/packets/packetTypes/genericPacket";
import { HostGameResponsePacket } from "../protocol/packets/rootGamePackets/hostGame";
import { PacketDestination, RootGamePacketType } from "../protocol/packets/types";
import { BaseRootGamePacket } from "../protocol/packets/basePacket";
import { DEFAULT_SERVER_PORT } from "../util/constants";
import { MessageReader } from "../util/hazelMessage";
import { Connection } from "../protocol/connection";
import { RemoteInfo } from "../util/remoteInfo";
import { Packet } from "../protocol/packets";
import { Level } from "../types/level";
import { Room } from "../room";
import dgram from "dgram";

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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public UDPServer: dgram.Socket;
  public connections: Map<string, Connection> = new Map();
  public connectionRoomMap: Map<string, Room> = new Map();
  public rooms: Room[] = [];

  // Starts at 1 to allow the Server host implementation's ID to be 0
  private connectionIdx = 1;

  constructor(
    public config: ServerConfig = DEFAULT_SERVER_CONFIG,
  ) {
    this.UDPServer = dgram.createSocket("udp4");

    this.UDPServer.on("message", (buf, remoteInfo) => {
      const sender = this.getConnection(remoteInfo);
      const packet = Packet.deserialize(MessageReader.fromRawBytes(buf), false);

      this.handlePacket(packet, sender);
    });
  }

  async listen(port: number = DEFAULT_SERVER_PORT): Promise<void> {
    return new Promise(resolve => {
      this.UDPServer.bind(port, "0.0.0.0", resolve);
    });
  }

  getConnection(remoteInfo: string | dgram.RemoteInfo): Connection {
    if (typeof remoteInfo != "string") {
      remoteInfo = RemoteInfo.toString(remoteInfo);
    }

    let con = this.connections.get(remoteInfo);

    if (con) return con;

    con = this.initializeConnection(RemoteInfo.fromString(remoteInfo));

    this.connections.set(remoteInfo, con);

    return con;
  }

  private initializeConnection(remoteInfo: dgram.RemoteInfo): Connection {
    const newCon = new Connection(remoteInfo, dgram.createSocket(remoteInfo.family == "IPv4" ? "udp4" : "udp6"), PacketDestination.Client);

    newCon.id = this.connectionIdx++;

    newCon.on("packet", (evt: RootGamePacketDataType) => this.handlePacket(evt, newCon));

    return newCon;
  }

  private handlePacket(packet: BaseRootGamePacket, sender: Connection): void {
    switch (packet.type) {
      case RootGamePacketType.HostGame: {
        const newRoom = new Room(this.config.defaultRoomAddress, this.config.defaultRoomPort, this.config.defaultHost == DefaultHostState.Server);

        this.rooms.push(newRoom);

        sender.send([ new HostGameResponsePacket(newRoom.code) ]);
        break;
      }
      case RootGamePacketType.JoinGame: {
        const room = this.connectionRoomMap.get(RemoteInfo.toString(sender));

        if (room) {
          this.connectionRoomMap.set(RemoteInfo.toString(sender), room);

          room.handleJoin(sender);
        } else {
          throw new Error(`Client ${sender.id} sent a ${RootGamePacketType[packet.type]} packet while not in a room`);
        }
        break;
      }
      case RootGamePacketType.GetGameList: {
        const rooms: RoomListing[] = [];
        const counts: [number, number, number] = [0, 0, 0];

        for (let i = 0; i < this.rooms.length; i++) {
          const room = this.rooms[i];

          counts[room.options.options.levels[0]]++;

          //TODO: Filter pog?
          rooms[i] = new RoomListing(
            room.address,
            room.port,
            room.code,
            "TODO: Player Name",
            room.players.length,
            // TODO: Age
            0,
            room.options.options.levels[0],
            room.options.options.impostorCount,
            room.options.options.maxPlayers,
          );
        }

        sender.send([ new GetGameListResponsePacket(rooms, counts[Level.TheSkeld], counts[Level.MiraHq], counts[Level.Polus]) ]);
        break;
      }
      default: {
        const room = this.connectionRoomMap.get(RemoteInfo.toString(sender));

        if (room) {
          room.handlePacket(packet, sender);
        } else {
          throw new Error(`Client [${sender.id}] sent a [${RootGamePacketType[packet.type]}] Packet while not mapped to the room, even though the server expects packets of this type to be handled on a room.`);
        }
      }
    }
  }
}
