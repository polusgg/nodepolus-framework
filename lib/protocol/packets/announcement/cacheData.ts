import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseAnnouncementPacket } from "../basePacket";
import { RootAnnouncementPacketType } from "../types";

export class CacheDataPacket extends BaseAnnouncementPacket {
  constructor() {
    super(RootAnnouncementPacketType.CacheData);
  }

  static deserialize(_reader: MessageReader): CacheDataPacket {
    return new CacheDataPacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
