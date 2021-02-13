import { Bitfield, ClientVersion, ConnectionInfo, DisconnectReason, Metadatable, NetworkAccessible, OutboundPacketTransformer } from "../../types";
import { AcknowledgementPacket, DisconnectPacket, HelloPacket, RootPacket } from "../packets/hazel";
import { BaseRootPacket, KickPlayerPacket, LateRejectionPacket } from "../packets/root";
import { LobbyHostAddedEvent, LobbyHostRemovedEvent } from "../../api/events/lobby";
import { PacketDestination, HazelPacketType } from "../packets/types/enums";
import { MAX_PACKET_BYTE_SIZE } from "../../util/constants";
import { MessageWriter } from "../../util/hazelMessage";
import { PlayerInstance } from "../../api/player";
import { AwaitingPacket } from "../packets/types";
import { LimboState } from "../../types/enums";
import { InternalLobby } from "../../lobby";
import { ConnectionEvents } from ".";
import { Packet } from "../packets";
import Emittery from "emittery";
import dgram from "dgram";

export class Connection extends Emittery.Typed<ConnectionEvents, "hello"> implements Metadatable, NetworkAccessible {
  public timeoutLength = 6000;
  public id = -1;
  public lobby?: InternalLobby;
  public limboState = LimboState.PreSpawn;
  public firstJoin = true;

  private readonly metadata: Map<string, unknown> = new Map();
  private readonly acknowledgementResolveMap: Map<number, ((value?: unknown) => void)[]> = new Map();
  private readonly flushResolveMap: Map<number, (value: void | PromiseLike<void>) => void> = new Map();
  private readonly unacknowledgedPackets: Map<number, number> = new Map();
  private readonly flushInterval: NodeJS.Timeout;
  // private readonly timeoutInterval: NodeJS.Timeout;

  private initialized = false;
  private hazelVersion?: number;
  private clientVersion?: ClientVersion;
  private name?: string;
  private actingHost = false;
  private packetBuffer: AwaitingPacket[] = [];
  private unreliablePacketBuffer: BaseRootPacket[] = [];
  private nonceIndex = 1;
  private disconnectTimeout: NodeJS.Timeout | undefined;
  private lastPingReceivedTime: number = Date.now();
  private requestedDisconnect = false;

  /**
   * @param connectionInfo - The ConnectionInfo describing the connection
   * @param socket - The underlying socket for the connection
   * @param packetDestination - The destination type for packets sent from the connection
   * @param outboundPacketTransformerSupplier - The supplier for the function used to transform outgoing packets
   */
  constructor(
    private readonly connectionInfo: ConnectionInfo,
    private readonly socket: dgram.Socket,
    private readonly packetDestination: PacketDestination,
    private readonly outboundPacketTransformerSupplier?: () => OutboundPacketTransformer | undefined,
  ) {
    super();

    this.on("message", reader => {
      if (!reader.hasBytesLeft()) {
        return;
      }

      const parsed = Packet.deserialize(reader, packetDestination == PacketDestination.Server, this.lobby?.getLevel());

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
          this.handleDisconnect((parsed.data as DisconnectPacket).disconnectReason);
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
    /**
     * TODO: Add max-connection-per-address logic
     * Use the value from `server.getMaxConnectionsPerAddress()`
     * We need to make sure we disconnect and remove references to all
     * connections when they die (client disconnects, server disconnects, client
     * loses connection/times out)
     */
  }

  hasMeta(key: string): boolean {
    return this.metadata.has(key);
  }

  getMeta(): Map<string, unknown>;
  getMeta<T = unknown>(key: string): T;
  getMeta<T = unknown>(key?: string): Map<string, unknown> | T {
    return key === undefined ? this.metadata : this.metadata.get(key) as T;
  }

  setMeta(pair: Record<string, unknown>): void;
  setMeta(key: string, value: unknown): void;
  setMeta(key: string | Record<string, unknown>, value?: unknown): void {
    if (typeof key === "string") {
      this.metadata.set(key, value);
    } else {
      for (const [k, v] of Object.entries(key)) {
        this.metadata.set(k, v);
      }
    }
  }

  deleteMeta(key: string): void {
    this.metadata.delete(key);
  }

  clearMeta(): void {
    this.metadata.clear();
  }

  /**
   * Gets the destination type for packets sent from the connection.
   */
  getPacketDestination(): PacketDestination {
    return this.packetDestination;
  }

  /**
   * Gets the version of Hazel that the connection is using.
   */
  getHazelVersion(): number | undefined {
    return this.hazelVersion;
  }

  /**
   * Gets the version of the Among Us client that the connection is using.
   */
  getClientVersion(): ClientVersion | undefined {
    return this.clientVersion;
  }

  /**
   * Gets the name that the connection requested for their player.
   */
  getName(): string | undefined {
    return this.name;
  }

  /**
   * Gets the ConnectionInfo describing the connection.
   */
  getConnectionInfo(): ConnectionInfo {
    return this.connectionInfo;
  }

  /**
   * Gets the elapsed time in seconds since the connection sent their last ping.
   */
  getTimeSinceLastPing(): number {
    return Date.now() - this.lastPingReceivedTime;
  }

  /**
   * Gets whether or not the connection is an acting host in their current
   * lobby.
   */
  isActingHost(): boolean {
    return this.actingHost;
  }

  /**
   * Sets whether or not the connection is an acting host in their lobby without
   * sending the packet.
   *
   * @param actingHost - `true` to add the acting host host status to the connection, `false` to remove it
   */
  updateActingHost(actingHost: boolean): void {
    this.actingHost = actingHost;
  }

  /**
   * Sets whether or not the connection is an acting host in their lobby.
   *
   * @param actingHost - `true` to add the acting host host status to the connection, `false` to remove it
   * @param sendImmediately - `true` to send the packet immediately, `false` to send it with the next batch of packets
   */
  async setActingHost(actingHost: boolean, sendImmediately: boolean = true): Promise<void> {
    if (!this.lobby) {
      return;
    }

    this.actingHost = actingHost;

    if (actingHost) {
      const event = new LobbyHostAddedEvent(this.lobby, this);

      await this.lobby.getServer().emit("lobby.host.added", event);

      if (event.isCancelled()) {
        return;
      }

      this.lobby.sendEnableHost(this, sendImmediately);
    } else {
      const event = new LobbyHostRemovedEvent(this.lobby, this);

      await this.lobby.getServer().emit("lobby.host.removed", event);

      if (event.isCancelled()) {
        return;
      }

      this.lobby.sendDisableHost(this, sendImmediately);
    }
  }

  /**
   * Sends the given packet in the next reliable packet group.
   *
   * @param packet - The packet to be sent
   */
  async writeReliable(packet: BaseRootPacket): Promise<void> {
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

  /**
   * Sends the given packet in the next unreliable packet group.
   *
   * @param packet - The packet to be sent
   */
  writeUnreliable(packet: BaseRootPacket): void {
    this.unreliablePacketBuffer.push(packet);
  }

  /**
   * Sends the given packet immediately as a reliable packet.
   *
   * @param packet - The packet to be sent
   */
  async sendReliable(packets: BaseRootPacket[]): Promise<void> {
    return new Promise(resolve => {
      const temp: AwaitingPacket[] = [...this.packetBuffer];

      this.packetBuffer = packets.map(packet => ({ packet, resolve }));

      this.flush(true);

      this.packetBuffer = temp;
    });
  }

  /**
   * Sends the given packet immediately as an unreliable packet.
   *
   * @param packet - The packet to be sent
   */
  sendUnreliable(packets: BaseRootPacket[]): void {
    const temp: BaseRootPacket[] = [...this.unreliablePacketBuffer];

    this.unreliablePacketBuffer = packets;

    this.flush(false);

    this.unreliablePacketBuffer = temp;
  }

  /**
   * Sends the current packet group to the connection.
   *
   * @param reliable - `true` to send the packet group as a reliable packet, `false` to send it as an unreliable packet
   */
  async flush(reliable: boolean = true): Promise<void> {
    return new Promise((resolve, reject) => {
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
        this.flushResolveMap.set(nonce, resolve);

        const resendInterval = setInterval(() => {
          if (this.unacknowledgedPackets.has(nonce!)) {
            if (this.unacknowledgedPackets.get(nonce!)! > 10) {
              this.disconnect(DisconnectReason.custom(`Failed to acknowledge packet ${nonce} after 10 attempts`));

              clearInterval(resendInterval);

              reject(new Error(`Connection ${this.id} did not acknowledge packet ${nonce} after 10 attempts`));
            } else {
              this.send(packetToSend.getBuffer());
            }
          } else {
            clearInterval(resendInterval);
          }
        }, 1000);
      }

      this.send(packetToSend.getBuffer());

      if (reliable) {
        this.packetBuffer = [];
      } else {
        this.unreliablePacketBuffer = [];
      }
    });
  }

  /**
   * Disconnects the connection from the server.
   *
   * @param reason - The reason for why the connection was disconnected
   */
  disconnect(reason?: DisconnectReason): void {
    this.requestedDisconnect = true;

    const packetToSend: MessageWriter = new Packet(undefined, new DisconnectPacket(true, reason)).serialize();

    this.send(packetToSend.getBuffer());

    this.disconnectTimeout = setTimeout(() => this.cleanup(reason), 6000);
  }

  /**
   * Kicks the connection from their lobby.
   *
   * @param isBanned - `true` if the connection is banned from the lobby, `false` if not
   * @param kickingPlayer - The player who kicked the connection, or `undefined` if the connection was kicked via the API
   * @param reason - The reason for why the connection was kicked
   */
  sendKick(isBanned: boolean, kickingPlayer?: PlayerInstance, reason?: DisconnectReason): void {
    if (!this.lobby) {
      throw new Error("Cannot kick a connection that is not in a lobby");
    }

    this.writeReliable(new KickPlayerPacket(
      this.lobby.getCode(),
      this.id,
      isBanned,
      reason ?? (isBanned ? DisconnectReason.banned() : DisconnectReason.kicked()),
    ));

    this.emit("kicked", {
      isBanned,
      kickingPlayer,
      reason,
    });
  }

  /**
   * Kicks the connection from the full lobby that it is trying to join for
   * being too slow to join.
   *
   * @param reason - The reason for why the connection was kicked
   */
  sendLateRejection(reason: DisconnectReason): void {
    if (!this.lobby) {
      throw new Error("Cannot send a LateRejection packet to a connection that is not in a lobby");
    }

    this.writeReliable(new LateRejectionPacket(
      this.lobby.getCode(),
      this.id,
      reason,
    ));
  }

  /**
   * Waits for the connection to send a packet that satisfies the condition in
   * the given callback.
   *
   * @param packetValidator - The callback used to check that a packet sent by the connection meets the expected conditions
   * @param timeoutTime - The time, in milliseconds, that the connection has to send the expected packet (default `6000`)
   * @returns A promise that resolves with the expected packet or rejects if the connection did not send the expected packet after `timeoutTime` milliseconds
   */
  async awaitPacket(packetValidator: (packet: BaseRootPacket) => boolean, timeoutTime: number = 6000): Promise<BaseRootPacket> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line prefer-const
      let timeout: NodeJS.Timeout;

      if (timeoutTime < 0) {
        timeoutTime = 6000;
      }

      const packetHandler = (packet: BaseRootPacket): void => {
        if (packetValidator(packet)) {
          this.off("packet", packetHandler);

          clearTimeout(timeout);

          resolve(packet);
        }
      };

      timeout = setTimeout(() => {
        this.off("packet", packetHandler);

        reject(new Error(`Connection ${this.id} did not reply with the expected packet within ${timeoutTime}ms`));
      }, timeoutTime);

      this.on("packet", packetHandler);
    });
  }

  /**
   * Updates the time at which the connection sent their last ping.
   *
   * @internal
   */
  private handlePing(): void {
    this.lastPingReceivedTime = Date.now();
  }

  /**
   * Gets an array of booleans representing the acknowledged status of the last
   * eight packets sent to the connection.
   *
   * @returns An array of booleans for the acknowledged status of the last eight packets
   */
  private getUnacknowledgedPacketArray(): boolean[] {
    let index = this.nonceIndex;
    const packets = new Array(8).fill(true);

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

  /**
   * Sends an acknowledgement packet for the packet with the given ID.
   *
   * @param nonce - The ID of the packet being acknowledged
   */
  private acknowledgePacket(nonce: number): void {
    this.send(new Packet(nonce, new AcknowledgementPacket(new Bitfield(this.getUnacknowledgedPacketArray()))).serialize().getBuffer());

    const resolveFunArr = this.acknowledgementResolveMap.get(nonce);

    if (resolveFunArr) {
      for (let i = 0; i < resolveFunArr.length; i++) {
        resolveFunArr[i]();
      }
    }

    this.acknowledgementResolveMap.delete(nonce);

    const resolve = this.flushResolveMap.get(nonce);

    this.flushResolveMap.delete(nonce);

    if (resolve) {
      resolve();
    }
  }

  /**
   * Removes the packet with the given ID from the map of packets sent to the
   * connection that haven't been acknowledged.
   *
   * @param nonce - The ID of the packet that has been acknowledged
   */
  private handleAcknowledgement(nonce: number): void {
    this.unacknowledgedPackets.delete(nonce);
  }

  /**
   * Finishes initializing the connection after receiving a Hello packet.
   *
   * @param helloPacket - The connection's Hello packet
   */
  private handleHello(helloPacket: HelloPacket): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.hazelVersion = helloPacket.hazelVersion;
    this.clientVersion = helloPacket.clientVersion;
    this.name = helloPacket.name;

    this.emit("hello");
  }

  /**
   * Sends a Disconnect packet to the connection.
   *
   * @param reason - The reason for why the connection was disconnected
   */
  private handleDisconnect(reason?: DisconnectReason): void {
    if (!this.requestedDisconnect) {
      this.send(Buffer.from([HazelPacketType.Disconnect]));
    }

    this.cleanup(reason);
  }

  /**
   * Stops sending packets at regular intervals to the connection.
   *
   * @param reason - The reason for why the connection was disconnected
   */
  private cleanup(reason?: DisconnectReason): void {
    clearInterval(this.flushInterval);
    // clearInterval(this.timeoutInterval);

    // TODO: socket.close() or socket.disconnect()

    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
    }

    this.emit("disconnected", reason);
  }

  /**
   * Sends the given byte buffer over the socket.
   *
   * @param buffer - The byte buffer to send over the socket
   */
  private send(buffer: Buffer): void {
    const outboundPacketTransformer = this.outboundPacketTransformerSupplier !== undefined
      ? this.outboundPacketTransformerSupplier()
      : undefined;

    if (outboundPacketTransformer !== undefined) {
      buffer = outboundPacketTransformer(this, new MessageWriter(buffer)).getBuffer();
    }

    this.socket.send(buffer, this.connectionInfo.getPort(), this.connectionInfo.getAddress());
  }
}
