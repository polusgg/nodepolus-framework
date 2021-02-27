import { AcknowledgementPacket, AnnouncementHelloPacket, DisconnectPacket, RootAnnouncementPacket } from "./hazel";
import { MessageReader, MessageWriter } from "../../util/hazelMessage";
import { HazelPacketType } from "../../types/enums";

type PacketDataType = AnnouncementHelloPacket
| AcknowledgementPacket
| DisconnectPacket
| RootAnnouncementPacket;

export class AnnouncementPacket {
  protected readonly type: HazelPacketType;

  constructor(
    public nonce: number | undefined,
    public data: PacketDataType,
  ) {
    if (data instanceof DisconnectPacket) {
      this.type = HazelPacketType.Disconnect;
    } else if (data instanceof AnnouncementHelloPacket) {
      this.type = HazelPacketType.Hello;
    } else if (data instanceof AcknowledgementPacket) {
      this.type = HazelPacketType.Ping;
    } else if (data instanceof RootAnnouncementPacket) {
      this.type = HazelPacketType.Reliable;
    } else {
      throw new Error(`Unsupported announcement packet type: ${typeof data}`);
    }
  }

  static deserialize(reader: MessageReader): AnnouncementPacket {
    const type = reader.readByte();
    let nonce: number | undefined;
    let data: PacketDataType;

    switch (type) {
      case HazelPacketType.Hello:
        nonce = reader.readUInt16(true);
        data = AnnouncementHelloPacket.deserialize(reader);
        break;
      case HazelPacketType.Disconnect:
        data = DisconnectPacket.deserialize(reader);
        break;
      case HazelPacketType.Acknowledgement:
        data = AcknowledgementPacket.deserialize(reader);
        break;
      default:
        throw new Error(`Attempted to deserialize an unimplemented announcement packet type: ${type} (${HazelPacketType[type]})`);
    }

    return new AnnouncementPacket(nonce, data);
  }

  getType(): HazelPacketType {
    return this.type;
  }

  clone(): AnnouncementPacket {
    return new AnnouncementPacket(this.nonce, this.data.clone());
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter().writeByte(this.type);

    if (this.nonce !== undefined) {
      writer.writeUInt16(this.nonce, true);
    }

    return writer.writeObject(this.data);
  }
}
