import { RootPacketDataType } from "../hazel/types";

export interface AwaitingPacket {
  packet: RootPacketDataType;

  resolve(value?: unknown): void;
}
