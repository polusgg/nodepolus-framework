import { BaseRootPacket } from "../root";

export interface AwaitingPacket {
  packet: BaseRootPacket;

  resolve(value?: unknown): void;
}
