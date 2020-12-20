import { PacketDestination } from "../protocol/packets/types/enums";
import { Connection } from "../protocol/connection";
import { ProxyInstance } from "./proxyInstance";
import { ProxyConfig, ProxyEvents } from ".";
import Emittery from "emittery";
import dgram from "dgram";

export class Proxy extends Emittery.Typed<ProxyEvents> implements ProxyInstance {
  public readonly serverConnection: Connection;

  private readonly toServerSocket: dgram.Socket = dgram.createSocket("udp4");

  constructor(public config: ProxyConfig, public clientConnection: Connection) {
    super();

    this.serverConnection = new Connection(config.server, this.toServerSocket, PacketDestination.Server);

    this.toServerSocket.on("message", msg => {
      this.serverConnection.emit("message", msg);
    });

    this.serverConnection.on("packet", packet => {
      this.clientConnection.emit("packet", packet);
    });
  }
}
