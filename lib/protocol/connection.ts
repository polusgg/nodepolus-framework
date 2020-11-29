import { AcknowledgementPacket } from "./packets/packetTypes/acknowledgementPacket";
import { DisconnectPacket } from "./packets/packetTypes/disconnectPacket";
import { MessageReader, MessageWriter } from "../util/hazelMessage";
import { HelloPacket } from "./packets/packetTypes/helloPacket";
import { ClientVersion } from "../util/clientVersion";
import { PacketType, PacketDestination } from "./packets/types";
import { RootGamePacket, RootGamePacketDataType } from "./packets/packetTypes/genericPacket";
import { Packet } from "./packets";
import Emittery from "emittery";
import { Socket } from "dgram";
import { DisconnectReason } from "../types/disconnectReason";
import { HostInstance } from "../host/types";
import { KickPlayerPacket } from "./packets/rootGamePackets/kickPlayer";
import { Room } from "../room";
import { LateRejectionPacket } from "./packets/rootGamePackets/removePlayer";
import { WaitForHostPacket } from "./packets/rootGamePackets/waitForHost";
import { Player } from "../player";
import { PlayerColor } from "../types/playerColor";
import { SystemType } from "../types/systemType";
import { RepairAmount } from "./packets/rootGamePackets/gameDataPackets/rpcPackets/repairSystem";
import { InnerPlayerControl } from "./entities/player/innerPlayerControl";
import { InnerLevel } from "./entities/types";

interface ConnectionEvents {
  packet: RootGamePacketDataType;
  disconnected?: DisconnectReason
}

export class Connection extends Emittery.Typed<ConnectionEvents> implements HostInstance {
  public initialized: boolean = false;
  public hazelVersion?: number;
  public clientVersion?: ClientVersion;
  public name?: string;
  public timeoutLength: number = 6000;
  public isHost: boolean = false;
  public id: number = -1;
  public room?: Room;
  public player?: Player;

  private packetBuffer: RootGamePacketDataType[] = [];
  private nonceIndex: number = 0;
  private unacknowledgedPackets: Map<number, number> = new Map();
  private flushInterval: NodeJS.Timeout;
  private timeoutInterval: NodeJS.Timeout;
  private disconnectTimeout: NodeJS.Timeout | undefined;
  private lastPingRecievedTime: number = Date.now();
  private requestedDisconnect: boolean = false;

  public get timeSinceLastPing(): number {
    return Date.now() - this.lastPingRecievedTime;
  }

  constructor(public socket: Socket, public bound: PacketDestination) {
    super();

    socket.on("message", buf => {
      let parsed = Packet.deserialize(MessageReader.fromRawBytes(buf), bound != PacketDestination.Server, this.room?.options.options.levels[0]);

      switch (parsed.type) {
        case PacketType.Reliable:
          this.acknowledgePacket(parsed.nonce!);
        case PacketType.Fragment:
          // Fragment types are handled unreliably in-game
        case PacketType.Unreliable:
          (<RootGamePacket>parsed.data).packets.forEach(packet => {
            this.emit("packet", packet);
          });
          break;
        case PacketType.Hello:
          this.handleHello(<HelloPacket>parsed.data);
          this.acknowledgePacket(parsed.nonce!);
          break;
        case PacketType.Ping:
          this.handlePing();
          this.acknowledgePacket(parsed.nonce!);
          break;
        case PacketType.Disconnect:
          this.handleDisconnection((<DisconnectPacket>parsed.data).reason);
          break;
        case PacketType.Acknowledgement:
          this.handleAcknowledgement(parsed.nonce!);
          break;
      }
    });

    this.flushInterval = setInterval(() => {
      if (this.packetBuffer.length > 0) {
        this.flush();
      }
    }, 10);

    this.timeoutInterval = setInterval(() => {
      if (this.timeSinceLastPing > this.timeoutLength) {
        this.disconnect(DisconnectReason.custom("Timed out"));
      }
    }, 1000);
  }

  private handlePing() {
    this.lastPingRecievedTime = Date.now();
  }

  private acknowledgePacket(nonce: number) {
    this.socket.send(new Packet(nonce, new AcknowledgementPacket(new Array(8).fill(true))).serialize().buffer);
  }

  private handleAcknowledgement(nonce: number) {}

  private handleHello(helloPacket: HelloPacket) {
    if (this.initialized) {
      throw new Error("Connection already recieved Hello.");
    }

    this.initialized = true;
    this.name = helloPacket.name;
    this.hazelVersion = helloPacket.hazelVersion;
    this.clientVersion = helloPacket.clientVersion;
  }

  write(pkt: RootGamePacketDataType) {
    this.packetBuffer.push(pkt);
  }

  send(pkts: RootGamePacketDataType[], reliable: boolean = true) {
    let temp: RootGamePacketDataType[] = [...this.packetBuffer];
    this.packetBuffer = pkts;

    this.flush(reliable);

    this.packetBuffer = temp;
  }

  flush(reliable: boolean = true) {
    let nonce: number | undefined;

    if (reliable) {
      nonce = this.nonceIndex++;
    }

    let packetToSend: MessageWriter = new Packet(nonce, new RootGamePacket(this.packetBuffer)).serialize();

    if (nonce) {
      this.unacknowledgedPackets.set(nonce, 0);

      let resendInterval = setInterval(() => {
        if (this.unacknowledgedPackets.has(nonce!)) {
          if (this.unacknowledgedPackets.get(nonce!)! > 10) {
            this.disconnect(DisconnectReason.custom(`Failed to acknowledge packet ${nonce} after 10 attempts.`));
            clearInterval(resendInterval);
          } else {
            this.socket.send(packetToSend.buffer);
          }
        } else {
          clearInterval(resendInterval);
        }
      }, 1000);
    }

    this.socket.send(packetToSend.buffer);

    this.packetBuffer = [];
  }

  disconnect(reason?: DisconnectReason) {
    this.requestedDisconnect = true;

    let packetToSend: MessageWriter = new Packet(undefined, new DisconnectPacket(reason)).serialize();

    this.socket.send(packetToSend.buffer);

    this.disconnectTimeout = setTimeout(() => {
      this.cleanup(reason);
    }, 6000);
  }

  private handleDisconnection(reason?: DisconnectReason) {
    if (!this.requestedDisconnect) {
      // No need to serialize a DisconnectReason object since there is no data
      this.socket.send([ PacketType.Disconnect ]);
    }

    this.cleanup(reason);
  }

  private cleanup(reason?: DisconnectReason) {
    clearInterval(this.flushInterval);
    clearInterval(this.timeoutInterval);

    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
    }

    this.emit("disconnected", reason);
  }

  public sendKick(isBanned: boolean, reason?: DisconnectReason) {
    if (!this.room)
      throw new Error("Can not kick a connection not in a room.");

    this.write(new KickPlayerPacket(
      this.room.code,
      this.id,
      isBanned,
      reason,
    ));
  }
  
  public sendLateRejection(reason: DisconnectReason) {
    if (!this.room)
      throw new Error("Can not send a lateRejection to a connection not in a room.");

    this.write(new LateRejectionPacket(
      this.room.code,
      this.id,
      reason,
    ));
  }

  public sendWaitingForHost() {
    if (!this.room)
      throw new Error("Can not send a wait for host packet to a connection not in a room.");

    this.write(new WaitForHostPacket(
      this.room.code,
      this.id,
    ));
  }

  public handleReady(sender: Connection) {}

  public handleSceneChange(sender: Connection, scene: string) {}

  public handleCheckName(sender: InnerPlayerControl, name: string) {}

  public handleCheckColor(sender: InnerPlayerControl, color: PlayerColor) {}

  public handleReportDeadBody(sender: InnerPlayerControl, victimPlayerId: number) {}

  public handleRepairSystem(sender: InnerLevel, systemId: SystemType, playerControlNetId: number, amount: RepairAmount) {}

  public handleCloseDoorsOfType(sender: InnerLevel, systemId: SystemType) {}
}
