import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReasonType } from "../../../types/enums";
import { DisconnectReason } from "../../../types";
import { HazelPacketType } from "../types/enums";
import { BaseHazelPacket } from ".";

export class DisconnectPacket extends BaseHazelPacket {
  public readonly disconnectReason?: DisconnectReason;

  constructor(disconnectReason?: DisconnectReason | DisconnectReasonType) {
    super(HazelPacketType.Acknowledgement);

    if (disconnectReason instanceof DisconnectReason) {
      this.disconnectReason = disconnectReason;
    } else if (disconnectReason) {
      this.disconnectReason = new DisconnectReason(disconnectReason);
    }
  }

  static deserialize(reader: MessageReader): DisconnectPacket {
    if (reader.getReadableBytesLength() > 0) {
      reader.readBoolean();

      const reason = reader.readMessage();

      if (reason) {
        return new DisconnectPacket(DisconnectReason.deserialize(reason));
      }
    }

    return new DisconnectPacket();
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter().writeBoolean(true);

    if (this.disconnectReason) {
      this.disconnectReason.serialize(writer);
    }

    return writer;
  }
}
