import { ServerPacketOutCustomEvent, ServerPacketOutEvent } from "../../api/events/server";
import { HazelMessage, MessageReader } from "../../util/hazelMessage";
import { BaseRootPacket } from "../packets/root";
import { DisconnectReason } from "../../types";

export type ConnectionEvents = {
  hello: HazelMessage;
  packet: BaseRootPacket;
  disconnected?: DisconnectReason;
  message: MessageReader;
  write: ServerPacketOutEvent;
  writeCustom: ServerPacketOutCustomEvent;
};
