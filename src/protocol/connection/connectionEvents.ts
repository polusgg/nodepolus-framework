import { ServerPacketOutCustomEvent, ServerPacketOutEvent } from "../../api/events/server";
import { MessageReader } from "../../util/hazelMessage";
import { BaseRootPacket } from "../packets/root";
import { DisconnectReason } from "../../types";

export type ConnectionEvents = {
  hello: undefined;
  packet: BaseRootPacket;
  disconnected?: DisconnectReason;
  message: MessageReader;
  write: ServerPacketOutEvent;
  writeCustom: ServerPacketOutCustomEvent;
};
