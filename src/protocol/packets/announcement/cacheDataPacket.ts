import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseAnnouncementPacket } from "./baseAnnouncementPacket";
import { AnnouncementPacketType } from "../../../types/enums";

/**
 * Announcement Packet ID: `0x00` (`0`)
 */
export class CacheDataPacket extends BaseAnnouncementPacket {
  constructor() {
    super(AnnouncementPacketType.CacheData);
  }

  static deserialize(_reader: MessageReader): CacheDataPacket {
    return new CacheDataPacket();
  }

  clone(): CacheDataPacket {
    return new CacheDataPacket();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serialize(_writer: MessageWriter): void {}
}
