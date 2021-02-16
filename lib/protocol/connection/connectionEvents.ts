import { ServerPacketOutCustomEvent, ServerPacketOutEvent } from "../../api/events/server";
import { MessageReader } from "../../util/hazelMessage";
import { PlayerInstance } from "../../api/player";
import { BaseRootPacket } from "../packets/root";
import { DisconnectReason } from "../../types";

export type ConnectionEvents = {
  packet: BaseRootPacket;
  disconnected?: DisconnectReason;
  message: MessageReader;
  write: ServerPacketOutEvent;
  writeCustom: ServerPacketOutCustomEvent;
  kicked: {
    isBanned: boolean;
    kickingPlayer?: PlayerInstance;
    reason?: DisconnectReason;
  };
};
