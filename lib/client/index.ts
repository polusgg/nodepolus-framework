import { DisconnectReason } from "../types/disconnectReason";
import { MessageReader } from "../util/hazelMessage";
import { Packet } from "../protocol/packets";
import { ClientInstance } from "./types";
import dgram from "dgram";

export interface ClientConfig {
  address: string;
  port: number;
}

export class Client implements ClientInstance {
  // TODO: client instance wasn't meant for an actual client :(((
  // TODO: no, it is. also you are going to create a connection on this right?
  public id = -1;
  public socket: dgram.Socket;

  constructor(public config: ClientConfig) {
    this.socket = dgram.createSocket("udp4");
    this.socket.on("message", buffer => {
      const packet = Packet.deserialize(MessageReader.fromRawBytes(buffer), true);

      this.handlePacket(packet);
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

  private handlePacket(packet: Packet): void {
    throw new Error("Method not implemented.");
  }
}
