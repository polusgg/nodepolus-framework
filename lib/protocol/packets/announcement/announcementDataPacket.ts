import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { AnnouncementPacketType } from "../../../types/enums";
import { BaseAnnouncementPacket } from ".";

/**
 * Announcement Packet ID: `0x01` (`1`)
 */
export class AnnouncementDataPacket extends BaseAnnouncementPacket {
  constructor(
    public announcementId: number,
    public text: string,
  ) {
    super(AnnouncementPacketType.AnnouncementData);
  }

  static deserialize(reader: MessageReader): AnnouncementDataPacket {
    return new AnnouncementDataPacket(
      reader.readPackedUInt32(),
      reader.readString(),
    );
  }

  clone(): AnnouncementDataPacket {
    return new AnnouncementDataPacket(this.announcementId, this.text);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.announcementId)
      .writeString(this.text);
  }
}
