import { BaseRootPacket, GameDataPacket, KickPlayerPacket, LateRejectionPacket, WaitForHostPacket } from "../packets/root";
import { Bitfield, ClientVersion, ConnectionInfo, DisconnectReason, NetworkAccessible } from "../../types";
import { AcknowledgementPacket, DisconnectPacket, HelloPacket, RootPacket } from "../packets/hazel";
import { PacketDestination, HazelPacketType } from "../packets/types/enums";
import { MessageReader, MessageWriter } from "../../util/hazelMessage";
import { ReadyPacket, SceneChangePacket } from "../packets/gameData";
import { MAX_PACKET_BYTE_SIZE } from "../../util/constants";
import { AwaitingPacket } from "../packets/types";
import { LimboState } from "../../types/enums";
import { InternalLobby } from "../../lobby";
import { ConnectionEvents } from ".";
import { Packet } from "../packets";
import Emittery from "emittery";
import dgram from "dgram";

export class Connection extends Emittery.Typed<ConnectionEvents, "hello"> implements NetworkAccessible {
  public hazelVersion?: number;
  public clientVersion?: ClientVersion;
  public name?: string;
  public timeoutLength = 6000;
  public isHost = false;
  public isActingHost = false;
  public id = -1;
  public lobby?: InternalLobby;
  public limboState = LimboState.PreSpawn;

  private readonly acknowledgementResolveMap: Map<number, ((value?: unknown) => void)[]> = new Map();
  private readonly unacknowledgedPackets: Map<number, number> = new Map();
  private readonly flushInterval: NodeJS.Timeout;
  // private readonly timeoutInterval: NodeJS.Timeout;

  private initialized = false;
  private packetBuffer: AwaitingPacket[] = [];
  private unreliablePacketBuffer: BaseRootPacket[] = [];
  private nonceIndex = 1;
  private disconnectTimeout: NodeJS.Timeout | undefined;
  private lastPingReceivedTime: number = Date.now();
  private requestedDisconnect = false;

  constructor(
    private readonly connectionInfo: ConnectionInfo,
    public socket: dgram.Socket,
    public bound: PacketDestination,
  ) {
    super();

    this.on("message", buf => {
      const parsed = Packet.deserialize(MessageReader.fromRawBytes(buf), bound == PacketDestination.Server, this.lobby?.options.levels[0]);

      if (parsed.isReliable()) {
        this.acknowledgePacket(parsed.nonce!);
      }

      switch (parsed.type) {
        case HazelPacketType.Reliable:
          // fallthrough
        case HazelPacketType.Fragment:
          // Hazel currently treats Fragment packets as Unreliable
          // fallthrough
        case HazelPacketType.Unreliable: {
          const packets = (parsed.data as RootPacket).packets;

          for (let i = 0; i < packets.length; i++) {
            this.emit("packet", packets[i]);
          }
          break;
        }
        case HazelPacketType.Hello:
          this.handleHello(parsed.data as HelloPacket);
          break;
        case HazelPacketType.Ping:
          this.handlePing();
          break;
        case HazelPacketType.Disconnect:
          this.handleDisconnection((parsed.data as DisconnectPacket).disconnectReason);
          break;
        case HazelPacketType.Acknowledgement:
          this.handleAcknowledgement(parsed.nonce!);
          break;
        default:
          throw new Error(`Socket received an unimplemented packet type: ${parsed.type} (${HazelPacketType[parsed.type]})`);
      }
    });

    this.flushInterval = setInterval(() => {
      if (this.packetBuffer.length > 0) {
        this.flush(true);
      }

      if (this.unreliablePacketBuffer.length > 0) {
        this.flush(false);
      }
    }, 50);

    // TODO: Timeout clients and remove dead connections
  }

  getConnectionInfo(): ConnectionInfo {
    return this.connectionInfo;
  }

  getTimeSinceLastPing(): number {
    return Date.now() - this.lastPingReceivedTime;
  }

  async write(packet: BaseRootPacket): Promise<void> {
    return new Promise(resolve => {
      this.packetBuffer.push({ packet, resolve });

      const currentPacket = new Packet(0, new RootPacket(this.packetBuffer.map(p => p.packet)));

      currentPacket.setClientBound(true);

      const currentPacketSerialized = currentPacket.serialize();

      if (currentPacketSerialized.getLength() > MAX_PACKET_BYTE_SIZE) {
        this.packetBuffer.pop();

        const singlePacket = new Packet(0, new RootPacket([packet]));

        singlePacket.setClientBound(true);

        const singlePacketSerialized = singlePacket.serialize();

        if (singlePacketSerialized.getLength() > MAX_PACKET_BYTE_SIZE) {
          throw new Error(`Attempted to write a packet that is longer than the maximum byte size of ${MAX_PACKET_BYTE_SIZE}`);
        } else {
          this.flush();

          this.packetBuffer = [{ packet, resolve }];
        }
      }
    });
  }

  writeUnreliable(packet: BaseRootPacket): void {
    this.unreliablePacketBuffer.push(packet);
  }

  async sendReliable(packets: BaseRootPacket[]): Promise<void> {
    return new Promise(resolve => {
      const temp: AwaitingPacket[] = [...this.packetBuffer];

      this.packetBuffer = packets.map(packet => ({ packet, resolve }));

      this.flush(true);

      this.packetBuffer = temp;
    });
  }

  sendUnreliable(packets: BaseRootPacket[]): void {
    const temp: BaseRootPacket[] = [...this.unreliablePacketBuffer];

    this.unreliablePacketBuffer = packets;

    this.flush(false);

    this.unreliablePacketBuffer = temp;
  }

  flush(reliable: boolean = true): void {
    if (this.unreliablePacketBuffer.length == 0 && this.packetBuffer.length == 0) {
      return;
    }

    let nonce: number | undefined;
    let packet: Packet;
    let packetBuffer: BaseRootPacket[] = [];

    if (reliable) {
      nonce = this.nonceIndex++ % 65536;

      const packetArr = new Array(this.packetBuffer.length);
      const resolveFuncs = new Array(this.packetBuffer.length);

      for (let i = 0; i < this.packetBuffer.length; i++) {
        const awaitingPacket = this.packetBuffer[i];

        packetArr[i] = awaitingPacket.packet;
        resolveFuncs[i] = awaitingPacket.resolve;
      }

      packetBuffer = packetArr;
      packet = new Packet(nonce, new RootPacket(packetBuffer));

      this.acknowledgementResolveMap.set(nonce!, resolveFuncs);
    } else {
      packet = new Packet(nonce, new RootPacket(this.unreliablePacketBuffer));
      packetBuffer = this.unreliablePacketBuffer;
    }

    packet.setClientBound(true);

    const packetToSend: MessageWriter = packet.serialize();

    if (nonce !== undefined) {
      this.unacknowledgedPackets.set(nonce, 0);

      const resendInterval = setInterval(() => {
        if (this.unacknowledgedPackets.has(nonce!)) {
          if (this.unacknowledgedPackets.get(nonce!)! > 10) {
            this.disconnect(DisconnectReason.custom(`Failed to acknowledge packet ${nonce} after 10 attempts`));

            clearInterval(resendInterval);
          } else {
            this.socket.send(packetToSend.getBuffer(), this.connectionInfo.getPort(), this.connectionInfo.getAddress());
          }
        } else {
          clearInterval(resendInterval);
        }
      }, 1000);
    }

    this.socket.send(packetToSend.getBuffer(), this.connectionInfo.getPort(), this.connectionInfo.getAddress());

    if (reliable) {
      this.packetBuffer = [];
    } else {
      this.unreliablePacketBuffer = [];
    }
  }

  disconnect(reason?: DisconnectReason): void {
    this.requestedDisconnect = true;

    const packetToSend: MessageWriter = new Packet(undefined, new DisconnectPacket(reason)).serialize();

    this.socket.send(packetToSend.getBuffer(), this.connectionInfo.getPort(), this.connectionInfo.getAddress());

    this.disconnectTimeout = setTimeout(() => this.cleanup(reason), 6000);
  }

  sendKick(isBanned: boolean, reason?: DisconnectReason): void {
    if (!this.lobby) {
      throw new Error("Cannot kick a connection that is not in a lobby");
    }

    this.write(new KickPlayerPacket(
      this.lobby.getCode(),
      this.id,
      isBanned,
      reason,
    ));
  }

  sendLateRejection(reason: DisconnectReason): void {
    if (!this.lobby) {
      throw new Error("Cannot send a LateRejection packet to a connection that is not in a lobby");
    }

    this.write(new LateRejectionPacket(
      this.lobby.getCode(),
      this.id,
      reason,
    ));
  }

  sendWaitingForHost(): void {
    if (!this.lobby) {
      throw new Error("Cannot send a WaitForHost packet to a connection that is not in a lobby");
    }

    this.write(new WaitForHostPacket(
      this.lobby.getCode(),
      this.id,
    ));
  }

  async handleSceneChange(sender: Connection, sceneName: string): Promise<void> {
    if (!this.lobby) {
      throw new Error("Cannot send a SceneChange packet to a connection that is not in a lobby");
    }

    return this.write(new GameDataPacket([
      new SceneChangePacket(sender.id, sceneName),
    ], this.lobby.getCode()));
  }

  handleReady(sender: Connection): void {
    if (!this.lobby) {
      throw new Error("Cannon send a Ready packet to a connection that is not in a lobby");
    }

    this.write(new GameDataPacket([
      new ReadyPacket(sender.id),
    ], this.lobby.getCode()));
  }

  private handlePing(): void {
    this.lastPingReceivedTime = Date.now();
  }

  private getUnacknowledgedPacketArray(): boolean[] {
    let index = this.nonceIndex;
    const packets = Array(8).fill(true);

    for (let i = 7; i >= 0; i--) {
      if (index < 1) {
        break;
      }

      if (this.unacknowledgedPackets.has(index)) {
        packets[i] = true;
      }

      index--;
    }

    return packets;
  }

  private acknowledgePacket(nonce: number): void {
    this.socket.send(
      new Packet(nonce, new AcknowledgementPacket(new Bitfield(this.getUnacknowledgedPacketArray()))).serialize().getBuffer(),
      this.connectionInfo.getPort(),
      this.connectionInfo.getAddress(),
    );

    const resolveFunArr = this.acknowledgementResolveMap.get(nonce);

    if (resolveFunArr) {
      for (let i = 0; i < resolveFunArr.length; i++) {
        resolveFunArr[i]();
      }
    }

    this.acknowledgementResolveMap.delete(nonce);
  }

  private handleAcknowledgement(nonce: number): void {
    this.unacknowledgedPackets.delete(nonce);
  }

  private handleHello(helloPacket: HelloPacket): void {
    if (this.initialized) {
      throw new Error(`Connection ${this.id} sent more than one Hello packet`);
    }

    this.initialized = true;
    this.name = helloPacket.name;
    this.hazelVersion = helloPacket.hazelVersion;
    this.clientVersion = helloPacket.clientVersion;

    this.emit("hello");
  }

  private handleDisconnection(reason?: DisconnectReason): void {
    if (!this.requestedDisconnect) {
      this.socket.send(Buffer.from([HazelPacketType.Disconnect]), this.connectionInfo.getPort(), this.connectionInfo.getAddress());
    }

    this.cleanup(reason);
  }

  private cleanup(reason?: DisconnectReason): void {
    clearInterval(this.flushInterval);
    // clearInterval(this.timeoutInterval);

    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
    }

    this.emit("disconnected", reason);
  }
}
