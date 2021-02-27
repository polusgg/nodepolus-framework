import { CacheDataPacket, AnnouncementDataPacket, SetLanguagesPacket, BaseAnnouncementPacket } from "../announcement";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { AnnouncementPacketType } from "../../../types/enums";

export class RootAnnouncementPacket {
  constructor(
    public packets: BaseAnnouncementPacket[],
  ) {}

  static deserialize(reader: MessageReader): RootAnnouncementPacket {
    const packets: BaseAnnouncementPacket[] = [];

    reader.readAllChildMessages(child => {
      switch (child.getTag()) {
        case AnnouncementPacketType.CacheData:
          packets.push(CacheDataPacket.deserialize(child));
          break;
        case AnnouncementPacketType.AnnouncementData:
          packets.push(AnnouncementDataPacket.deserialize(child));
          break;
        case AnnouncementPacketType.SetLanguage:
          packets.push(SetLanguagesPacket.deserialize(child));
          break;
      }
    });

    return new RootAnnouncementPacket(packets);
  }

  clone(): RootAnnouncementPacket {
    const packets = new Array(this.packets.length);

    for (let i = 0; i < packets.length; i++) {
      packets[i] = this.packets[i].clone();
    }

    return new RootAnnouncementPacket(packets);
  }

  serialize(writer: MessageWriter): void {
    for (let i = 0; i < this.packets.length; i++) {
      writer.startMessage(this.packets[i].getType())
        .writeObject(this.packets[i])
        .endMessage();
    }
  }
}
