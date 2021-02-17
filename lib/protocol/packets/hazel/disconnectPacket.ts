import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReasonType } from "../../../types/enums";
import { DisconnectReason } from "../../../types";
import { HazelPacketType } from "../types/enums";
import { BaseHazelPacket } from ".";

export class DisconnectPacket extends BaseHazelPacket {
  public disconnectReason?: DisconnectReason;

  constructor(
    public isForced?: boolean,
    disconnectReason?: DisconnectReason | DisconnectReasonType,
  ) {
    super(HazelPacketType.Acknowledgement);

    if (disconnectReason instanceof DisconnectReason) {
      this.disconnectReason = disconnectReason;
    } else if (disconnectReason) {
      this.disconnectReason = new DisconnectReason(disconnectReason);
    }
  }

  static deserialize(reader: MessageReader): DisconnectPacket {
    if (reader.hasBytesLeft()) {
      const isForced = reader.readBoolean();

      if (isForced) {
        return new DisconnectPacket(isForced, DisconnectReason.deserialize(reader.readMessage() ?? new MessageReader()));
      }

      return new DisconnectPacket(isForced);
    }

    return new DisconnectPacket();
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    if (this.isForced !== undefined) {
      writer.writeBoolean(this.isForced);

      if (this.isForced) {
        (this.disconnectReason ?? DisconnectReason.custom("")).serialize(writer);
      }
    }

    return writer;
  }
}
