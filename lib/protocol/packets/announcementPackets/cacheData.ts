import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseAnnouncementPacket } from "../basePacket";
import { RootAnnouncementPacketType } from "../types";

export class CacheDataPacket extends BaseAnnouncementPacket {
  constructor() {
    super(RootAnnouncementPacketType.CacheData);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static deserialize(_reader: MessageReader): CacheDataPacket {
    return new CacheDataPacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
