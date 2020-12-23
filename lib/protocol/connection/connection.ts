import { GameDataPacket, KickPlayerPacket, LateRejectionPacket, WaitForHostPacket } from "../packets/root";
import { AcknowledgementPacket, DisconnectPacket, HelloPacket, RootPacket } from "../packets/hazel";
import { PacketDestination, HazelPacketType } from "../packets/types/enums";
import { LimboState, PlayerColor, SystemType } from "../../types/enums";
import { Bitfield, ClientVersion, DisconnectReason } from "../../types";
import { MessageReader, MessageWriter } from "../../util/hazelMessage";
import { ReadyPacket, SceneChangePacket } from "../packets/gameData";
import { RepairAmount } from "../packets/rpc/repairSystem/amounts";
import { BaseInnerShipStatus } from "../entities/baseShipStatus";
import { RootPacketDataType } from "../packets/hazel/types";
import { InnerPlayerControl } from "../entities/player";
import { AwaitingPacket } from "../packets/types";
import { HostInstance } from "../../host";
import { ConnectionEvents } from ".";
import { Lobby } from "../../lobby";
import { Packet } from "../packets";
import Emittery from "emittery";
import dgram from "dgram";

export class Connection extends Emittery.Typed<ConnectionEvents> implements HostInstance, dgram.RemoteInfo {
  public hazelVersion?: number;
  public clientVersion?: ClientVersion;
  public name?: string;
  public timeoutLength = 6000;
  public isHost = false;
  public isActingHost = false;
  public id = -1;
  public lobby?: Lobby;
  public limboState = LimboState.PreSpawn;
  public address: string;
  public port: number;
  public family: "IPv4" | "IPv6";
  public size = -1;

  private readonly acknowledgementResolveMap: Map<number, ((value?: unknown) => void)[]> = new Map();
  private readonly unacknowledgedPackets: Map<number, number> = new Map();
  private readonly flushInterval: NodeJS.Timeout;
  // private readonly timeoutInterval: NodeJS.Timeout;

  private initialized = false;
  private packetBuffer: AwaitingPacket[] = [];
  private unreliablePacketBuffer: RootPacketDataType[] = [];
  private nonceIndex = 1;
  private disconnectTimeout: NodeJS.Timeout | undefined;
  private lastPingReceivedTime: number = Date.now();
  private requestedDisconnect = false;

  constructor(remoteInfo: dgram.RemoteInfo, public socket: dgram.Socket, public bound: PacketDestination) {
    super();

    this.address = remoteInfo.address;
    this.port = remoteInfo.port;
    this.family = remoteInfo.family;

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
            this.log(packets[i], parsed, true);
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

    // TODO: This breaks. No clue why.
    // this.timeoutInterval = setInterval(() => {
    //   if (this.timeSinceLastPing > this.timeoutLength) {
    //     this.disconnect(DisconnectReason.custom("Connection timed out"));
    //   }
    // }, 1000);
  }

  getTimeSinceLastPing(): number {
    return Date.now() - this.lastPingReceivedTime;
  }

  async write(packet: RootPacketDataType): Promise<void> {
    return new Promise(resolve => {
      this.packetBuffer.push({ packet, resolve });
    });

    // const lastElem: RootGamePacketDataType = this.packetBuffer[this.packetBuffer.length - 1];

    // if (
    //   this.packetBuffer.length != 0 &&
    //   lastElem.type == packet.type &&
    //   (
    //     packet.type == RootGamePacketType.GameData ||
    //     packet.type == RootGamePacketType.GameDataTo
    //   ) &&
    //   (lastElem as GameDataPacket).lobbyCode == (packet as GameDataPacket).lobbyCode &&
    //   (lastElem as GameDataPacket).targetClientId == (packet as GameDataPacket).targetClientId
    // ) {
    //   for (let i = 0; i < (packet as GameDataPacket).packets.length; i++) {
    //     const gameDataSinglePacket = (packet as GameDataPacket).packets[i];

    //     (this.packetBuffer[this.packetBuffer.length - 1] as GameDataPacket).packets.push(gameDataSinglePacket);
    //   }
    // } else {
    //   this.packetBuffer.push(packet);
    // }
  }

  writeUnreliable(packet: RootPacketDataType): void {
    this.unreliablePacketBuffer.push(packet);
  }

  async sendReliable(packets: RootPacketDataType[]): Promise<void> {
    return new Promise(resolve => {
      const temp: AwaitingPacket[] = [...this.packetBuffer];

      this.packetBuffer = packets.map(packet => ({ packet, resolve }));
      this.flush(true);
      this.packetBuffer = temp;
    });
  }

  sendUnreliable(packets: RootPacketDataType[]): void {
    const temp: RootPacketDataType[] = [...this.unreliablePacketBuffer];

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
    let packetBuffer: RootPacketDataType[] = [];

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

      for (let i = 0; i < packetBuffer.length; i++) {
        this.log(packetBuffer[i], packet, false);
      }
    } else {
      packet = new Packet(nonce, new RootPacket(this.unreliablePacketBuffer));
      packetBuffer = this.unreliablePacketBuffer;

      for (let i = 0; i < packetBuffer.length; i++) {
        this.log(packetBuffer[i], packet, false);
      }
    }

    packet.bound(true);

    const packetToSend: MessageWriter = packet.serialize();

    if (nonce !== undefined) {
      this.unacknowledgedPackets.set(nonce, 0);

      const resendInterval = setInterval(() => {
        if (this.unacknowledgedPackets.has(nonce!)) {
          if (this.unacknowledgedPackets.get(nonce!)! > 10) {
            this.disconnect(DisconnectReason.custom(`Failed to acknowledge packet ${nonce} after 10 attempts`));

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

    if (reliable) {
      this.packetBuffer = [];
    } else {
      this.unreliablePacketBuffer = [];
    }
  }

  disconnect(reason?: DisconnectReason): void {
    this.requestedDisconnect = true;

    const packetToSend: MessageWriter = new Packet(undefined, new DisconnectPacket(reason)).serialize();

    this.socket.send(packetToSend.buffer, this.port, this.address);

    this.disconnectTimeout = setTimeout(() => this.cleanup(reason), 6000);
  }

  sendKick(isBanned: boolean, reason?: DisconnectReason): void {
    if (!this.lobby) {
      throw new Error("Cannot kick a connection that is not in a lobby");
    }

    this.write(new KickPlayerPacket(
      this.lobby.code,
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
      this.lobby.code,
      this.id,
      reason,
    ));
  }

  sendWaitingForHost(): void {
    if (!this.lobby) {
      throw new Error("Cannot send a WaitForHost packet to a connection that is not in a lobby");
    }

    this.write(new WaitForHostPacket(
      this.lobby.code,
      this.id,
    ));
  }

  handleSceneChange(sender: Connection, scene: string): void {
    if (!this.lobby) {
      throw new Error("Cannot send a SceneChange packet to a connection that is not in a lobby");
    }

    this.write(new GameDataPacket([
      new SceneChangePacket(sender.id, scene),
    ], this.lobby.code));
  }

  handleReady(sender: Connection): void {
    if (!this.lobby) {
      throw new Error("Cannon send a Ready packet to a connection that is not in a lobby");
    }

    this.write(new GameDataPacket([
      new ReadyPacket(sender.id),
    ], this.lobby.code));
  }

  // These are no-ops because we expect the connection to implement these

  /* eslint-disable @typescript-eslint/no-empty-function */
  handleCheckName(_sender: InnerPlayerControl, _name: string): void {}
  handleCheckColor(_sender: InnerPlayerControl, _color: PlayerColor): void {}
  handleReportDeadBody(_sender: InnerPlayerControl, _victimPlayerId: number): void {}
  handleRepairSystem(_sender: BaseInnerShipStatus, _systemId: SystemType, _playerControlNetId: number, _amount: RepairAmount): void {}
  handleCloseDoorsOfType(_sender: BaseInnerShipStatus, _systemId: SystemType): void {}
  handleSetStartCounter(_sequenceId: number, _timeRemaining: number): void {}
  handleCompleteTask(_sender: InnerPlayerControl, _taskIndex: number): void {}
  handleMurderPlayer(_sender: InnerPlayerControl, _victimPlayerControlNetId: number): void {}
  handleUsePlatform(_sender: InnerPlayerControl): void {}
  handleImpostorDeath(): void {}
  handleCastVote(_votingPlayerId: number, _suspectPlayerId: number): void {}
  setInfected(_impostorCount: number): void {}
  setTasks(): void {}
  /* eslint-enable @typescript-eslint/no-empty-function */

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
      new Packet(nonce, new AcknowledgementPacket(new Bitfield(this.getUnacknowledgedPacketArray()))).serialize().buffer,
      this.port,
      this.address,
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
      throw new Error("Connection already received a Hello packet");
    }

    this.initialized = true;
    this.name = helloPacket.name;
    this.hazelVersion = helloPacket.hazelVersion;
    this.clientVersion = helloPacket.clientVersion;
  }

  private handleDisconnection(reason?: DisconnectReason): void {
    if (!this.requestedDisconnect) {
      this.socket.send(Buffer.from([HazelPacketType.Disconnect]), this.port, this.address);
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private log(packet: RootPacketDataType, parsed: Packet, isToServer: boolean): void {
    // if (!parsed.isReliable) {
    //   return;
    // }

    // if (isToServer) {
    //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    //   console.log(`[${this.id} @ ${this.address}:${this.port}] > [Server] : Sent ${RootGamePacketType[packet.type]} in a ${parsed.isReliable ? "Reliable" : "Unreliable"} packet${parsed.isReliable ? ` with nonce ${parsed.nonce}` : ""}`);
    // } else {
    //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    //   console.log(`[Server] > [${this.id} @ ${this.address}:${this.port}] : Sent ${RootGamePacketType[packet.type]} in a ${parsed.isReliable ? "Reliable" : "Unreliable"} packet${parsed.isReliable ? ` with nonce ${parsed.nonce}` : ""}`);
    // }

    // if (packet.type == RootGamePacketType.GameData || packet.type == RootGamePacketType.GameDataTo) {
    //   // console.log((packet as GameDataPacket).packets);
    //   const prefix = " ".repeat(`[${this.id} @ ${this.address}:${this.port}] > [Server] : Sent `.length);

    //   console.log(`${prefix}│`);
    //   console.log(`${prefix}├─[Lobby Code]─> ${(packet as GameDataPacket).lobbyCode}`);
    //   console.log(`${prefix}├─[Recipient]─> ${(packet as GameDataPacket).targetClientId ?? "ALL"}`);
    //   console.log(`${prefix}└─[Packets]`);

    //   (packet as GameDataPacket).packets.forEach((subpacket, index, { length }) => {
    //     console.log(`${prefix}  ${index == length - 1 ? "└" : "├"}─[${index}]─> ${GameDataPacketType[subpacket.type]}${subpacket.type == GameDataPacketType.RPC ? ` > ${RPCPacketType[(subpacket as RPCPacket).packet.type]}` : ""}`);
    //   });
    // }
  }
}
