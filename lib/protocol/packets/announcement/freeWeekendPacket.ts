import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseAnnouncementPacket } from "./baseAnnouncementPacket";
import { AnnouncementPacketType } from "../types/enums";
import { FreeWeekendState } from "../../../types/enums";

export class FreeWeekendPacket extends BaseAnnouncementPacket {
  constructor(public state: FreeWeekendState) {
    super(AnnouncementPacketType.AnnouncementData);
  }

  static deserialize(reader: MessageReader): FreeWeekendPacket {
    return new FreeWeekendPacket(reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.state);
  }
}
