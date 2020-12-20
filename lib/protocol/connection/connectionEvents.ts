import { RootPacketDataType } from "../packets/hazel/types";
import { DisconnectReason } from "../../types";

export type ConnectionEvents = {
  packet: RootPacketDataType;
  disconnected?: DisconnectReason;
  message: Buffer;
};
