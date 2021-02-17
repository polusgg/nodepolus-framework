import { MessageWriter } from "../../../util/hazelMessage";
import { AnnouncementPacketType } from "../types/enums";

export abstract class BaseAnnouncementPacket {
  constructor(
    public type: AnnouncementPacketType,
  ) {}

  abstract clone(): BaseAnnouncementPacket;

  abstract serialize(): MessageWriter;
}
