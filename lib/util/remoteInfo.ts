import dgram from 'dgram'
import { IPV4_REGEX, IPV6_REGEX } from './constants';

export class RemoteInfo {
  static toString(rInfo: dgram.RemoteInfo) {
    return `${rInfo.address}:${rInfo.port}`;
  }
  static fromString(rInfo: string): dgram.RemoteInfo {
    let o = {
      address: rInfo.split(":")[0],
      port: parseInt(rInfo.split(":")[1])
    }
    if (IPV4_REGEX.test(rInfo))
      return {
        ...o,
        family: "IPv4",
        size: -1
      }
    if (IPV6_REGEX.test(rInfo))
      return {
        ...o,
        family: "IPv6",
        size: -1
      }
    throw new Error(`Could not map "${o.address}" from "${rInfo}" to either a IPv4 or IPv6 IP`)
  }
}
