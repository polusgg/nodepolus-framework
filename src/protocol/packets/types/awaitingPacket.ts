import { BaseRootPacket } from "../root";

/**
 * An interface used to mark any implementing packet as one whose receipt must
 * be acknowledged.
 */
// TODO: Remove and wrap packets in a Promise
export interface AwaitingPacket {
  packet: BaseRootPacket;

  resolve(value?: unknown): void;
  reject(value?: unknown): void;
}
