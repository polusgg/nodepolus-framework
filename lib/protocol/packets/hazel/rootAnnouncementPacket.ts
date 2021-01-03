import { CacheDataPacket, AnnouncementDataPacket, FreeWeekendPacket, BaseAnnouncementPacket } from "../announcement";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { AnnouncementPacketType } from "../types/enums";

export class RootAnnouncementPacket {
  constructor(public readonly packets: BaseAnnouncementPacket[]) {}

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
        case AnnouncementPacketType.FreeWeekend:
          packets.push(FreeWeekendPacket.deserialize(child));
          break;
      }
    });

    return new RootAnnouncementPacket(packets);
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    for (let i = 0; i < this.packets.length; i++) {
      writer.startMessage(this.packets[i].type)
        .writeBytes(this.packets[i].serialize())
        .endMessage();
    }

    return writer;
  }
}
