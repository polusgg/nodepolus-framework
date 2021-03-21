import { Bitfield, ClientVersion, ConnectionInfo, DisconnectReason, Metadatable, NetworkAccessible, OutboundPacketTransformer } from "../../types";
import { HazelPacketType, LimboState, PacketDestination, RootPacketType, RuntimePlatform, Scene } from "../../types/enums";
import { BaseRootPacket, JoinGameErrorPacket, KickPlayerPacket, LateRejectionPacket } from "../packets/root";
import { AcknowledgementPacket, DisconnectPacket, HelloPacket, RootPacket } from "../packets/hazel";
import { ServerPacketOutCustomEvent, ServerPacketOutEvent } from "../../api/events/server";
import { LobbyHostAddedEvent, LobbyHostRemovedEvent } from "../../api/events/lobby";
import { PlayerBannedEvent, PlayerKickedEvent } from "../../api/events/player";
import { MAX_PACKET_BYTE_SIZE } from "../../util/constants";
import { MessageWriter } from "../../util/hazelMessage";
import { PlayerInstance } from "../../api/player";
import { AwaitingPacket } from "../packets/types";
import { ConnectionEvents } from ".";
import { Lobby } from "../../lobby";
import { Packet } from "../packets";
import Emittery from "emittery";
import dgram from "dgram";

export class Connection extends Emittery.Typed<ConnectionEvents, "hello"> implements Metadatable, NetworkAccessible {
  protected readonly metadata: Map<string, unknown> = new Map();
  protected readonly acknowledgementResolveMap: Map<number, ((value?: unknown) => void)[]> = new Map();
  protected readonly flushResolveMap: Map<number, (value: void | PromiseLike<void>) => void> = new Map();
  protected readonly unacknowledgedPackets: Map<number, number> = new Map();
  protected readonly flushInterval: NodeJS.Timeout;
  // protected readonly timeoutInterval: NodeJS.Timeout;

  protected id = -1;
  protected initialized = false;
  protected hazelVersion?: number;
  protected clientVersion?: ClientVersion;
  protected name?: string;
  protected platform?: RuntimePlatform;
  protected lastPingReceivedTime: number = Date.now();
  protected lobby?: Lobby;
  protected firstJoin = true;
  protected limboState = LimboState.PreSpawn;
  protected currentScene: Scene = Scene.MMOnline;
  protected actingHost = false;
  protected packetBuffer: AwaitingPacket[] = [];
  protected unreliablePacketBuffer: BaseRootPacket[] = [];
  protected nonceIndex = 1;
  protected disconnectTimeout?: NodeJS.Timeout;
  protected requestedDisconnect = false;
  // protected timeoutLength = 6000;

  /**
   * @param connectionInfo - The ConnectionInfo describing the connection
   * @param socket - The underlying socket for the connection
   * @param packetDestination - The destination type for packets sent from the connection
   * @param outboundPacketTransformerSupplier - The supplier for the function used to transform outgoing packets
   */
  constructor(
    protected readonly connectionInfo: ConnectionInfo,
    protected readonly socket: dgram.Socket,
    protected readonly packetDestination: PacketDestination,
    protected readonly outboundPacketTransformerSupplier?: () => OutboundPacketTransformer | undefined,
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

      switch (parsed.getType()) {
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
          throw new Error(`Socket received an unimplemented packet type: ${parsed.getType()} (${HazelPacketType[parsed.getType()]})`);
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
   * Gets the client ID of the connection.
   */
  getId(): number {
    return this.id;
  }

  /**
   * Sets the client ID of the connection.
   *
   * A connection's client ID may only be set once, subsequent calls to this
   * method will do nothing.
   *
   * @param id - The new client ID of the connection
   */
  setId(id: number): this {
    if (this.id === -1) {
      this.id = id;
    }

    return this;
  }

  /**
   * Gets whether or not the connection has been initialized with a Hello
   * packet.
   *
   * @returns `true` if the connection has issued a Hello packet, `false` if not
   */
  isInitialized(): boolean {
    return this.initialized;
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
   * Gets the platform on which this connection is playing.
   */
  getPlatform(): RuntimePlatform | undefined {
    return this.platform;
  }

  /**
   * Sets the platform on which this connection is playing.
   *
   * @param platform - The new platform on which this connection is playing
   */
  setPlatform(platform?: RuntimePlatform): this {
    this.platform = platform;

    return this;
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
   * Gets the lboby in which this connection is located.
   */
  getLobby(): Lobby | undefined {
    return this.lobby;
  }

  /**
   * Sets the lobby in which this connection is located.
   *
   * @param lobby - The new lobby in which this connection is located
   */
  setLobby(lobby?: Lobby): this {
    this.lobby = lobby;

    return this;
  }

  /**
   * Gets whether or not the connection is rejoining their current lobby after
   * the end of a game.
   *
   * @returns `true` if the connection is rejoining their current lobby, `false` if they are joining it for the first time in their session
   */
  isRejoining(): boolean {
    if (this.firstJoin) {
      this.firstJoin = false;

      return false;
    }

    return true;
  }

  /**
   * Gets the current limbo state of the connection.
   */
  getLimboState(): LimboState {
    return this.limboState;
  }

  /**
   * Sets the current limbo state of the connection.
   *
   * @param limbState - The new limbo state of the connection
   */
  setLimboState(limbState: LimboState): this {
    this.limboState = limbState;

    return this;
  }

  /**
   * Gets the scene that the connection is in.
   */
  getCurrentScene(): Scene {
    return this.currentScene;
  }

  /**
   * Sets the scene that the connection is in.
   *
   * @param scene - The new scene that the connection is in
   */
  setCurrentScene(scene: Scene): this {
    this.currentScene = scene;

    return this;
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
  setActingHost(actingHost: boolean): this {
    this.actingHost = actingHost;

    return this;
  }

  /**
   * Sets whether or not the connection is an acting host in their lobby.
   *
   * @param actingHost - `true` to add the acting host host status to the connection, `false` to remove it
   * @param sendImmediately - `true` to send the packet immediately, `false` to send it with the next batch of packets
   */
  async syncActingHost(actingHost: boolean, sendImmediately: boolean = true): Promise<void> {
    if (this.lobby === undefined) {
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

        this.acknowledgementResolveMap.set(nonce, resolveFuncs);
      } else {
        packet = new Packet(nonce, new RootPacket(this.unreliablePacketBuffer));
        packetBuffer = this.unreliablePacketBuffer;
      }

      packet.setClientBound(true);

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
              this.send(packet);
            }
          } else {
            clearInterval(resendInterval);
          }
        }, 1000);
      }

      this.send(packet);

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

    this.send(new Packet(undefined, new RootPacket([new JoinGameErrorPacket(reason ?? DisconnectReason.exitGame())])));
    this.send(new Packet(undefined, new DisconnectPacket(true, reason ?? DisconnectReason.exitGame())));

    this.disconnectTimeout = setTimeout(() => this.cleanup(reason), 6000);
  }

  /**
   * Kicks the connection from their lobby.
   *
   * @param isBanned - `true` if the connection is banned from the lobby, `false` if not
   * @param kickingPlayer - The player who kicked the connection, or `undefined` if the connection was kicked via the API
   * @param reason - The reason for why the connection was kicked
   */
  async sendKick(isBanned: boolean, kickingPlayer?: PlayerInstance, reason?: DisconnectReason): Promise<void> {
    if (this.lobby === undefined) {
      throw new Error("Cannot kick a connection that is not in a lobby");
    }

    const player = this.lobby.findSafePlayerByConnection(this);

    if (isBanned) {
      const banEvent = new PlayerBannedEvent(this.lobby, player, kickingPlayer, reason);

      await this.lobby.getServer().emit("player.banned", banEvent);

      if (banEvent.isCancelled()) {
        return;
      }
    } else {
      const kickEvent = new PlayerKickedEvent(this.lobby, player, kickingPlayer, reason);

      await this.lobby.getServer().emit("player.kicked", kickEvent);

      if (kickEvent.isCancelled()) {
        return;
      }
    }

    this.writeReliable(new KickPlayerPacket(
      this.lobby.getCode(),
      this.id,
      isBanned,
      reason ?? (isBanned ? DisconnectReason.banned() : DisconnectReason.kicked()),
    ));
  }

  /**
   * Kicks the connection from the full lobby that it is trying to join for
   * being too slow to join.
   *
   * @param reason - The reason for why the connection was kicked
   */
  sendLateRejection(reason: DisconnectReason): void {
    if (this.lobby === undefined) {
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
  protected handlePing(): void {
    this.lastPingReceivedTime = Date.now();
  }

  /**
   * Gets an array of booleans representing the acknowledged status of the last
   * eight packets sent to the connection.
   *
   * @returns An array of booleans for the acknowledged status of the last eight packets
   */
  protected getUnacknowledgedPacketArray(): boolean[] {
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
  protected acknowledgePacket(nonce: number): void {
    this.send(new Packet(nonce, new AcknowledgementPacket(new Bitfield(this.getUnacknowledgedPacketArray()))));

    const resolveFunArr = this.acknowledgementResolveMap.get(nonce);

    if (resolveFunArr !== undefined) {
      for (let i = 0; i < resolveFunArr.length; i++) {
        resolveFunArr[i]();
      }
    }

    this.acknowledgementResolveMap.delete(nonce);

    const resolve = this.flushResolveMap.get(nonce);

    this.flushResolveMap.delete(nonce);

    if (resolve !== undefined) {
      resolve();
    }
  }

  /**
   * Removes the packet with the given ID from the map of packets sent to the
   * connection that haven't been acknowledged.
   *
   * @param nonce - The ID of the packet that has been acknowledged
   */
  protected handleAcknowledgement(nonce: number): void {
    this.unacknowledgedPackets.delete(nonce);
  }

  /**
   * Finishes initializing the connection after receiving a Hello packet.
   *
   * @param helloPacket - The connection's Hello packet
   */
  protected handleHello(helloPacket: HelloPacket): void {
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
  protected handleDisconnect(reason?: DisconnectReason): void {
    if (!this.requestedDisconnect) {
      this.send(new Packet(undefined, new DisconnectPacket()));
    }

    this.cleanup(reason);
  }

  /**
   * Stops sending packets at regular intervals to the connection.
   *
   * @param reason - The reason for why the connection was disconnected
   */
  protected cleanup(reason?: DisconnectReason): void {
    clearInterval(this.flushInterval);
    // clearInterval(this.timeoutInterval);

    // TODO: socket.close() or socket.disconnect()

    if (this.disconnectTimeout !== undefined) {
      clearTimeout(this.disconnectTimeout);
      delete this.disconnectTimeout;
    }

    this.emit("disconnected", reason);
  }

  /**
   * Sends the given packet over the socket.
   *
   * @param packet - The packet to send over the socket
   */
  protected async send(packet: Packet): Promise<void> {
    const writeListeners = this.listenerCount("write");
    const writeCustomListeners = this.listenerCount("writeCustom");

    if (writeListeners > 0 || writeCustomListeners > 0) {
      if (packet.getType() === HazelPacketType.Reliable || packet.getType() === HazelPacketType.Unreliable) {
        packet = packet.clone();

        const subpackets = (packet.data as RootPacket).packets;
        const filteredIndices: number[] = [];

        for (let i = 0; i < subpackets.length; i++) {
          const subpacket = subpackets[i];

          if (subpacket.getType() in RootPacketType) {
            if (writeListeners > 0) {
              const event = new ServerPacketOutEvent(this, subpacket);

              await this.emit("write", event);

              if (event.isCancelled()) {
                filteredIndices.push(i);
              }
            }
          } else if (writeCustomListeners > 0) {
            const event = new ServerPacketOutCustomEvent(this, subpacket);

            await this.emit("writeCustom", event);

            if (event.isCancelled()) {
              filteredIndices.push(i);
            }
          }
        }

        for (let i = filteredIndices.length - 1; i >= 0; i--) {
          subpackets.splice(filteredIndices[i], 1);
        }
      }
    }

    let buffer = packet.serialize().getBuffer();
    const outboundPacketTransformer = this.outboundPacketTransformerSupplier !== undefined
      ? this.outboundPacketTransformerSupplier()
      : undefined;

    if (outboundPacketTransformer !== undefined) {
      buffer = outboundPacketTransformer(this, new MessageWriter(buffer)).getBuffer();
    }

    this.socket.send(buffer, this.connectionInfo.getPort(), this.connectionInfo.getAddress());
  }
}
