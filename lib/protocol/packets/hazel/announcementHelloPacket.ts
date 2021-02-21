import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { ClientLanguage, HazelPacketType } from "../../../types/enums";
import { BaseHazelPacket } from ".";

export class AnnouncementHelloPacket extends BaseHazelPacket {
  constructor(
    public announcementVersion: number,
    public lastAnnouncementId: number,
    public language: ClientLanguage,
  ) {
    super(HazelPacketType.Hello);
  }

  static deserialize(reader: MessageReader): AnnouncementHelloPacket {
    reader.readInt16();

    return new AnnouncementHelloPacket(
      reader.readPackedInt32(),
      reader.readPackedInt32(),
      reader.readPackedUInt32() as ClientLanguage,
    );
  }

  clone(): AnnouncementHelloPacket {
    return new AnnouncementHelloPacket(this.announcementVersion, this.lastAnnouncementId, this.language);
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedInt32(this.announcementVersion)
      .writePackedInt32(this.lastAnnouncementId)
      .writePackedUInt32(this.language);
  }
}
