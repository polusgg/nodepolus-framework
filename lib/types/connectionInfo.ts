import { AddressFamily } from "./enums";
import ipaddr from "ipaddr.js";

export class ConnectionInfo {
  constructor(
    private readonly address: string,
    private readonly port: number,
    private readonly family: AddressFamily,
  ) {}

  static fromString(infoString: string): ConnectionInfo {
    const parts = infoString.split(":");

    if (parts.length < 2) {
      throw new Error(`Invalid syntax: expected "address:port"`);
    }

    const port = parseInt(parts.splice(-1, 1)[0], 10);
    const address = parts.join(":");
    let family: AddressFamily;

    if (port < 1 || port > 65535) {
      throw new Error(`Port is outside UDP port range: 1 <= ${port} <= 65535`);
    }

    if (ipaddr.IPv4.isValid(address)) {
      family = AddressFamily.IPv4;
    } else if (ipaddr.IPv6.isValid(address)) {
      family = AddressFamily.IPv6;
    } else {
      throw new Error(`Address is neither IPv4 nor IPv6: ${address}`);
    }

    return new ConnectionInfo(address, port, family);
  }

  getAddress(): string {
    return this.address;
  }

  getPort(): number {
    return this.port;
  }

  getFamily(): AddressFamily {
    return this.family;
  }

  toString(): string {
    return `${this.address}:${this.port}`;
  }
}
