import { DisconnectReason } from "../types/disconnectReason";
import { ClientInstance } from "./types";
import dgram from "dgram";

export interface ClientConfig {
  address: string;
  port: number;
}

export class Client implements ClientInstance {
  public id: number;
  public socket: dgram.Socket;

  constructor(public config: ClientConfig) {
    this.socket = dgram.createSocket("udp4");
    this.socket.on("message", buffer => {

    });
  }

  async connect(): Promise<void> {
    return new Promise(resolve => {
      this.socket.connect(this.config.port, this.config.address, resolve);
    });
  }

  sendKick(banned: boolean, reason: DisconnectReason): void {
    throw new Error("Method not implemented.");
  }

  sendLateRejection(disconnectReason: DisconnectReason): void {
    throw new Error("Method not implemented.");
  }

  sendWaitingForHost(): void {
    throw new Error("Method not implemented.");
  }

  private handlePacket(): void{

  }
}
