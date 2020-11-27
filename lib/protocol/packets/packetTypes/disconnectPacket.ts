import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReason } from "../../../types/disconnectReason";
import { BasePacket } from "../basePacket";
import { PacketType } from "../types";

export class DisconnectPacket extends BasePacket {
  constructor(public unknown: number, public reason?: DisconnectReason) {
    super(PacketType.Acknowledgement);
  }

  static deserialize(reader: MessageReader): DisconnectPacket {
    let unknown = reader.readByte();
    let reason = reader.readMessage();

    if (reason) {
      return new DisconnectPacket(
        unknown,
        DisconnectReason.deserialize(reason)
      );
    }

    return new DisconnectPacket(unknown);
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();

    writer.writeByte(this.unknown);

    if (this.reason) {
      this.reason.serialize(writer);
    }

    return writer;
  }
}
