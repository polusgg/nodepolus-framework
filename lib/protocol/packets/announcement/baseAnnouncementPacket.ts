import { AnnouncementPacketType } from "../../../types/enums";
import { MessageWriter } from "../../../util/hazelMessage";

export abstract class BaseAnnouncementPacket {
  constructor(
    protected readonly type: AnnouncementPacketType,
  ) {}

  abstract clone(): BaseAnnouncementPacket;

  abstract serialize(): MessageWriter;

  getType(): AnnouncementPacketType {
    return this.type;
  }
}
