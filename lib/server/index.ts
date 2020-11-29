import dgram from 'dgram'
import { Connection } from '../protocol/connection';
import { RemoteInfo } from '../util/remoteInfo';
import { PacketDestination, RootGamePacketType } from '../protocol/packets/types';
import { Room } from '../room';
import { JoinedGamePacket } from '../protocol/packets/rootGamePackets/joinedGame';
import { BaseRootGamePacket } from '../protocol/packets/basePacket';
import { HostGameResponsePacket } from '../protocol/packets/rootGamePackets/hostGame';

enum ServerSAAHState {
  Never,
  Always,
  Sometimes
}

interface ServerConfig {
  port: number;
  defaultSAAHState: ServerSAAHState;
}

let DefaultServerConfig: ServerConfig = {
  port: 22023,
  defaultSAAHState: ServerSAAHState.Always
}

export class Server {
  public UDPServer: dgram.Socket;
  public connections: Map<string, Connection> = new Map()
  public connectionRoomMap: Map<string, Room> = new Map()
  public rooms: Room[] = [];

  constructor(public config: ServerConfig = DefaultServerConfig) {
    this.UDPServer = dgram.createSocket('udp4')

    this.UDPServer.on('message', (buf, remoteInfo) => {

    })
  }

  getConnection(remoteInfo: string | dgram.RemoteInfo) {
    if(typeof remoteInfo != 'string') {
      remoteInfo = RemoteInfo.toString(remoteInfo)
    }

    if(this.connections.has(remoteInfo))
      return this.connections.get(remoteInfo)

    let newCon = this.initializeConnection(RemoteInfo.fromString(remoteInfo))
    this.connections.set(remoteInfo, newCon)
    return newCon
  }

  private initializeConnection(remoteInfo: dgram.RemoteInfo): Connection {
    let newCon = new Connection(remoteInfo, dgram.createSocket(remoteInfo.family == "IPv4" ? 'udp4' : 'udp6'), PacketDestination.Client)
    
    /* connection init code goes here once i can be bothered */

    return newCon
  }

  private handlePacket(packet: BaseRootGamePacket, sender: Connection) {
    switch(packet.type) {
      case RootGamePacketType.HostGame:
        let newRoom = new Room();
        
        this.rooms.push(newRoom)

        sender.send([new HostGameResponsePacket(newRoom.code)])
        break;
      case RootGamePacketType.JoinGame:
        break;
      case RootGamePacketType.GetGameList:
        break;
      default:
        if(this.connectionRoomMap.has(RemoteInfo.toString(sender))) {
          this.connectionRoomMap.get(RemoteInfo.toString(sender))!.handlePacket(packet, sender)
        } else {
          throw new Error(`Client [${sender.id}] sent a [${RootGamePacketType[packet.type]}] Packet while not mapped to the room, even though the server expects packets of this type to be handled on a room.`)
        }
    }
  }
}
7
