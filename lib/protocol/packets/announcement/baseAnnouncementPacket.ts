import { AnnouncementPacketType } from "../../../types/enums";
import { MessageWriter } from "../../../util/hazelMessage";

export abstract class BaseAnnouncementPacket {
  constructor(
    public type: AnnouncementPacketType,
  ) {}

  abstract clone(): BaseAnnouncementPacket;

  abstract serialize(): MessageWriter;
}
