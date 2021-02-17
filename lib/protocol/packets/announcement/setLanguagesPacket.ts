import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseAnnouncementPacket } from "./baseAnnouncementPacket";
import { AnnouncementPacketType } from "../types/enums";

/**
 * Announcement Packet ID: `0x04` (`4`)
 */
export class SetLanguagesPacket extends BaseAnnouncementPacket {
  constructor(
    public languages: Map<number, string>,
  ) {
    super(AnnouncementPacketType.SetLanguage);
  }

  static deserialize(reader: MessageReader): SetLanguagesPacket {
    const languages: [number, string][] = reader.readList(sub => {
      const name = sub.readString();

      return [sub.readUInt32(), name];
    }, false);

    return new SetLanguagesPacket(new Map([...languages]));
  }

  clone(): SetLanguagesPacket {
    return new SetLanguagesPacket(new Map(this.languages));
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeList(this.languages, (writer, item) => {
      writer.writeString(item[1]).writeUInt32(item[0]);
    }, false);
  }
}
