import { AddressFamily } from "./enums";
import ipaddr from "ipaddr.js";

/**
 * A class used to store, encode, and decode an IP address and port pair.
 */
export class ConnectionInfo {
  /**
   * @param address - The IP address
   * @param port - The port
   * @param family - The family that the IP address belongs to
   */
  constructor(
    private readonly address: string,
    private readonly port: number,
    private readonly family: AddressFamily,
  ) {}

  /**
   * Gets a ConnectionInfo from a stringified address-port pair.
   *
   * @param infoString - The stringified address-port pair
   */
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

  /**
   * Gets the IP address.
   */
  getAddress(): string {
    return this.address;
  }

  /**
   * Gets the port.
   */
  getPort(): number {
    return this.port;
  }

  /**
   * Gets the family that the IP address belongs to.
   */
  getFamily(): AddressFamily {
    return this.family;
  }

  /**
   * Gets the ConnectionInfo in a stringified form of `address:port`.
   */
  toString(): string {
    return `${this.address}:${this.port}`;
  }
}
