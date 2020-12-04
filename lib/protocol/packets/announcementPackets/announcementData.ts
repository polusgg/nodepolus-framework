import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseAnnouncementPacket } from "../basePacket";
import { RootAnnouncementPacketType } from "../types";

export class AnnouncementDataPacket extends BaseAnnouncementPacket {
  constructor(
    public uniqueId: number,
    public text: string,
  ) {
    super(RootAnnouncementPacketType.AnnouncementData);
  }

  static deserialize(reader: MessageReader): AnnouncementDataPacket {
    return new AnnouncementDataPacket(
      reader.readPackedUInt32(),
      reader.readString(),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.uniqueId).writeString(this.text);
  }
}
