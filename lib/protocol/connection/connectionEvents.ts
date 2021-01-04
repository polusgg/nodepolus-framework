import { PlayerInstance } from "../../api/player";
import { BaseRootPacket } from "../packets/root";
import { DisconnectReason } from "../../types";

export type ConnectionEvents = {
  packet: BaseRootPacket;
  disconnected?: DisconnectReason;
  message: Buffer;
  kicked: {
    isBanned: boolean;
    kickingPlayer?: PlayerInstance;
    reason?: DisconnectReason;
  };
};
