import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType } from "../../../types/enums";
import { DisconnectReason } from "../../../types";
import { BaseHazelPacket } from ".";

export class DisconnectPacket extends BaseHazelPacket {
  constructor(
    public isForced?: boolean,
    public disconnectReason?: DisconnectReason,
  ) {
    super(HazelPacketType.Acknowledgement);
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

  clone(): DisconnectPacket {
    return new DisconnectPacket(this.isForced, this.disconnectReason?.clone());
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
