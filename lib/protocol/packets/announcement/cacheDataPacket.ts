import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseAnnouncementPacket } from "./baseAnnouncementPacket";
import { AnnouncementPacketType } from "../types/enums";

export class CacheDataPacket extends BaseAnnouncementPacket {
  constructor() {
    super(AnnouncementPacketType.CacheData);
  }

  static deserialize(_reader: MessageReader): CacheDataPacket {
    return new CacheDataPacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}