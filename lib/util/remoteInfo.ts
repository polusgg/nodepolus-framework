import { IPV4_REGEX, IPV6_REGEX } from "./constants";
import dgram from "dgram";

export class RemoteInfo {
  static toString(info: dgram.RemoteInfo): string {
    return `${info.address}:${info.port}`;
  }

  static fromString(info: string): dgram.RemoteInfo {
    const o = {
      address: info.split(":")[0],
      port: parseInt(info.split(":")[1], 10),
    };

    if (IPV4_REGEX.test(info)) {
      return {
        ...o,
        family: "IPv4",
        size: -1,
      };
    }

    if (IPV6_REGEX.test(info)) {
      return {
        ...o,
        family: "IPv6",
        size: -1,
      };
    }

    throw new Error(`Could not map "${o.address}" from "${info}" to an IPv4 or IPv6 address`);
  }
}
