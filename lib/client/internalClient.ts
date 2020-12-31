import { PacketDestination } from "../protocol/packets/types/enums";
import { ConnectionInfo, DisconnectReason } from "../types";
import { Connection } from "../protocol/connection";
import { ClientInstance } from "../api/client";
import { ClientConfig } from "../api/config";
import dgram from "dgram";

export class InternalClient implements ClientInstance {
  private readonly socket: dgram.Socket;
  private readonly connection: Connection;
  private readonly id = -1;

  constructor(protected config: ClientConfig) {
    this.socket = dgram.createSocket("udp4");
    this.connection = new Connection(
      ConnectionInfo.fromString(`${config.address}:${config.port}`),
      this.socket,
      PacketDestination.Server,
    );

    this.socket.on("message", buffer => {
      this.connection.emit("message", buffer);
    });
  }

  async connect(): Promise<void> {
    return new Promise(resolve => {
      this.socket.connect(this.config.port, this.config.address, resolve);
    });
  }

  disconnect(): void {
    // TODO
  }

  getId(): number {
    return this.id;
  }

  sendKick(_banned: boolean, _reason: DisconnectReason): void {
    throw new Error("Method not implemented.");
  }

  sendLateRejection(_disconnectReason: DisconnectReason): void {
    throw new Error("Method not implemented.");
  }

  sendWaitingForHost(): void {
    throw new Error("Method not implemented.");
  }
}
