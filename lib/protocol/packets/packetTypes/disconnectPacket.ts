import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReason } from "../../../types/disconnectReason";
import { BasePacket } from "../basePacket";
import { PacketType } from "../types";

export class DisconnectPacket extends BasePacket {
  constructor(public reason?: DisconnectReason) {
    super(PacketType.Acknowledgement);
  }

  static deserialize(reader: MessageReader): DisconnectPacket {
    reader.readBoolean(); // Fucking Forte

    let reason = reader.readMessage();

    if (reason) {
      return new DisconnectPacket(DisconnectReason.deserialize(reason));
    }

    return new DisconnectPacket();
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter().writeBoolean(true); // For real, though...

    if (this.reason) {
      this.reason.serialize(writer);
    }

    return writer;
  }
}
