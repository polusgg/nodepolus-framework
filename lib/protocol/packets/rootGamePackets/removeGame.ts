import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReason } from "../../../types/disconnectReason";
import { BaseRootGamePacket } from "../basePacket";
import { RootGamePacketType } from "../types";

export class RemoveGamePacket extends BaseRootGamePacket {
  constructor(readonly disconnectReason?: DisconnectReason) {
    super(RootGamePacketType.RemoveGame);
  }

  static deserialize(reader: MessageReader): RemoveGamePacket {
    return new RemoveGamePacket(reader.hasBytesLeft() ? new DisconnectReason(reader.readByte()) : undefined);
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    if (this.disconnectReason) {
      this.disconnectReason.serialize(writer);
    }

    return writer;
  }
}
