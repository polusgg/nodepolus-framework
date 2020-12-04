import { FreeWeekendState } from "../../../types/freeWeekendState";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseAnnouncementPacket } from "../basePacket";
import { RootAnnouncementPacketType } from "../types";

export class FreeWeekendPacket extends BaseAnnouncementPacket {
  constructor(public state: FreeWeekendState) {
    super(RootAnnouncementPacketType.AnnouncementData);
  }

  static deserialize(reader: MessageReader): FreeWeekendPacket {
    return new FreeWeekendPacket(reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.state);
  }
}
