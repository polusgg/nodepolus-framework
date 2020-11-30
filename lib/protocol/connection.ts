import { RepairAmount } from "./packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { RootGamePacket, RootGamePacketDataType } from "./packets/packetTypes/genericPacket";
import { AcknowledgementPacket } from "./packets/packetTypes/acknowledgementPacket";
import { LateRejectionPacket } from "./packets/rootGamePackets/removePlayer";
import { DisconnectPacket } from "./packets/packetTypes/disconnectPacket";
import { InnerPlayerControl } from "./entities/player/innerPlayerControl";
import { WaitForHostPacket } from "./packets/rootGamePackets/waitForHost";
import { KickPlayerPacket } from "./packets/rootGamePackets/kickPlayer";
import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { HelloPacket } from "./packets/packetTypes/helloPacket";
import { PacketDestination, PacketType } from "./packets/types";
import { DisconnectReason } from "../types/disconnectReason";
import { ClientVersion } from "../util/clientVersion";
import { PlayerColor } from "../types/playerColor";
import { SystemType } from "../types/systemType";
import { InnerLevel } from "./entities/types";
import { HostInstance } from "../host/types";
import dgram from "dgram";
import { Packet } from "./packets";
import { Player } from "../player";
import Emittery from "emittery";
import { Room } from "../room";

interface ConnectionEvents {
  packet: RootGamePacketDataType;
  disconnected?: DisconnectReason;
  message: Buffer;
}

export class Connection extends Emittery.Typed<ConnectionEvents> implements HostInstance, dgram.RemoteInfo {
  public initialized = false;
  public hazelVersion?: number;
  public clientVersion?: ClientVersion;
  public name?: string;
  public timeoutLength = 6000;
  public isHost = false;
  public id = -1;
  public room?: Room;
  public player?: Player;
  public address: string;
  public port: number;
  public family: "IPv4" | "IPv6";
  public size = -1;

  private readonly unacknowledgedPackets: Map<number, number> = new Map();
  private readonly flushInterval: NodeJS.Timeout;
  private readonly timeoutInterval: NodeJS.Timeout;

  private packetBuffer: RootGamePacketDataType[] = [];
  private nonceIndex = 0;
  private disconnectTimeout: NodeJS.Timeout | undefined;
  private lastPingRecievedTime: number = Date.now();
  private requestedDisconnect = false;

  get timeSinceLastPing(): number {
    return Date.now() - this.lastPingRecievedTime;
  }

  constructor(remoteInfo: dgram.RemoteInfo, public socket: dgram.Socket, public bound: PacketDestination) {
    super();

    this.address = remoteInfo.address;
    this.port = remoteInfo.port;
    this.family = remoteInfo.family;

    this.on("message", buf => {
      const parsed = Packet.deserialize(MessageReader.fromRawBytes(buf), bound == PacketDestination.Server, this.room?.options.options.levels[0]);

      if (parsed.isReliable) {
        this.acknowledgePacket(parsed.nonce!);
      }

      console.log(parsed);

      switch (parsed.type) {
        case PacketType.Reliable:
          // fallthrough
        case PacketType.Fragment:
          /**
           * Hazel currently treats Fragment packets as Unreliable
           */
          // fallthrough
        case PacketType.Unreliable: {
          (parsed.data as RootGamePacket).packets.forEach(packet => {
            this.emit("packet", packet);
          });
          break;
        }
        case PacketType.Hello:
          this.handleHello(parsed.data as HelloPacket);
          break;
        case PacketType.Ping:
          this.handlePing();
          break;
        case PacketType.Disconnect:
          this.handleDisconnection((parsed.data as DisconnectPacket).reason);
          break;
        case PacketType.Acknowledgement:
          this.handleAcknowledgement(parsed.nonce!);
          break;
        default:
          throw new Error(`Socket got unexpected packet type ${parsed.type}`);
      }
    });

    this.flushInterval = setInterval(() => {
      if (this.packetBuffer.length > 0) {
        this.flush();
      }
    }, 10);

    this.timeoutInterval = setInterval(() => {
      if (this.timeSinceLastPing > this.timeoutLength) {
        this.disconnect(DisconnectReason.custom("Connection timed out"));
      }
    }, 1000);
  }

  write(pkt: RootGamePacketDataType): void {
    this.packetBuffer.push(pkt);
  }

  send(pkts: RootGamePacketDataType[], reliable: boolean = true): void {
    const temp: RootGamePacketDataType[] = [ ...this.packetBuffer ];

    this.packetBuffer = pkts;

    this.flush(reliable);

    this.packetBuffer = temp;
  }

  flush(reliable: boolean = true): void {
    let nonce: number | undefined;

    if (reliable) {
      nonce = this.nonceIndex++;
    }

    const packet = new Packet(nonce, new RootGamePacket(this.packetBuffer));

    packet.bound(true);
    console.log("Writing", packet);

    const packetToSend: MessageWriter = packet.serialize();

    if (nonce) {
      this.unacknowledgedPackets.set(nonce, 0);

      const resendInterval = setInterval(() => {
        if (this.unacknowledgedPackets.has(nonce!)) {
          if (this.unacknowledgedPackets.get(nonce!)! > 10) {
            this.disconnect(DisconnectReason.custom(`Failed to acknowledge packet ${nonce} after 10 attempts.`));
            clearInterval(resendInterval);
          } else {
            this.socket.send(packetToSend.buffer, this.port, this.address);
          }
        } else {
          clearInterval(resendInterval);
        }
      }, 1000);
    }

    this.socket.send(packetToSend.buffer, this.port, this.address);

    this.packetBuffer = [];
  }

  disconnect(reason?: DisconnectReason): void {
    this.requestedDisconnect = true;

    const packetToSend: MessageWriter = new Packet(undefined, new DisconnectPacket(reason)).serialize();

    this.socket.send(packetToSend.buffer, this.port, this.address);

    this.disconnectTimeout = setTimeout(() => {
      this.cleanup(reason);
    }, 6000);
  }

  sendKick(isBanned: boolean, reason?: DisconnectReason): void {
    if (!this.room) {
      throw new Error("Cannot kick a connection that is not in a room");
    }

    this.write(new KickPlayerPacket(
      this.room.code,
      this.id,
      isBanned,
      reason,
    ));
  }

  sendLateRejection(reason: DisconnectReason): void {
    if (!this.room) {
      throw new Error("Cannot send a LateRejection packet to a connection that is not in a room");
    }

    this.write(new LateRejectionPacket(
      this.room.code,
      this.id,
      reason,
    ));
  }

  sendWaitingForHost(): void {
    if (!this.room) {
      throw new Error("Cannot send a WaitForHost packet to a connection that is not in a room");
    }

    this.write(new WaitForHostPacket(
      this.room.code,
      this.id,
    ));
  }

  // These are NOOPs because we expect the connection to implement these

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  handleReady(_sender: Connection): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  handleSceneChange(_sender: Connection, _scene: string): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  handleCheckName(_sender: InnerPlayerControl, _name: string): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  handleCheckColor(_sender: InnerPlayerControl, _color: PlayerColor): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  handleReportDeadBody(_sender: InnerPlayerControl, _victimPlayerId: number): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  handleRepairSystem(_sender: InnerLevel, _systemId: SystemType, _playerControlNetId: number, _amount: RepairAmount): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  handleCloseDoorsOfType(_sender: InnerLevel, _systemId: SystemType): void {}

  private handlePing(): void {
    this.lastPingRecievedTime = Date.now();
  }

  private acknowledgePacket(nonce: number): void {
    const a = new Packet(nonce, new AcknowledgementPacket(new Array(8).fill(true))).serialize().buffer;

    console.log(a);

    this.socket.send(a, this.port, this.address);
  }

  private handleAcknowledgement(nonce: number): void {
    this.unacknowledgedPackets.delete(nonce);
  }

  private handleHello(helloPacket: HelloPacket): void {
    if (this.initialized) {
      throw new Error("Connection already recieved a Hello packet");
    }

    this.initialized = true;
    this.name = helloPacket.name;
    this.hazelVersion = helloPacket.hazelVersion;
    this.clientVersion = helloPacket.clientVersion;
  }

  private handleDisconnection(reason?: DisconnectReason): void {
    if (!this.requestedDisconnect) {
      // No need to serialize a DisconnectReason object since there is no data
      this.socket.send([ PacketType.Disconnect ], this.port, this.address);
    }

    this.cleanup(reason);
  }

  private cleanup(reason?: DisconnectReason): void {
    clearInterval(this.flushInterval);
    clearInterval(this.timeoutInterval);

    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
    }

    this.emit("disconnected", reason);
  }
}
