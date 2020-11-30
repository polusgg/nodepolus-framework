import dgram from "dgram";

export class RemoteInfo {
  static toString(info: dgram.RemoteInfo): string {
    return `${info.address}:${info.port}`;
  }

  static fromString(info: string): dgram.RemoteInfo {
    return {
      address: info.split(":")[0],
      port: parseInt(info.split(":")[1], 10),
      size: -1,
      family: "IPv4",
    };

    // TODO: IPv6 Support

    // throw new Error(`Could not map "${o.address}" from "${info}" to an IPv4 or IPv6 address`);
  }
}
