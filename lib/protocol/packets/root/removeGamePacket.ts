import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { DisconnectReason } from "../../../types";
import { RootPacketType } from "../types/enums";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x03` (`3`)
 */
export class RemoveGamePacket extends BaseRootPacket {
  constructor(
    public readonly disconnectReason?: DisconnectReason,
  ) {
    super(RootPacketType.RemoveGame);
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
