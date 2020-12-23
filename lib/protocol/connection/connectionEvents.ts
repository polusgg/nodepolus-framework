import { BaseRootPacket } from "../packets/root";
import { DisconnectReason } from "../../types";

export type ConnectionEvents = {
  packet: BaseRootPacket;
  disconnected?: DisconnectReason;
  message: Buffer;
};
