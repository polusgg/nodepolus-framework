import { AnnouncementPacketType } from "../../../types/enums";
import { MessageWriter } from "../../../util/hazelMessage";
import { CanSerializeToHazel } from "../../../types";

export abstract class BaseAnnouncementPacket implements CanSerializeToHazel {
  constructor(
    protected readonly type: AnnouncementPacketType,
  ) {}

  abstract clone(): BaseAnnouncementPacket;

  abstract serialize(writer: MessageWriter): void;

  getType(): AnnouncementPacketType {
    return this.type;
  }
}
