import { BaseRootPacket } from "../protocol/packets/root";

export type ProxyEvents = {
  packetFromClient: BaseRootPacket;
  packetFromServer: BaseRootPacket;
};
