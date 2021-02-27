import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../../../types/enums";
import { DisconnectReason } from "../../../types";
import { BaseRootPacket } from "../root";

/**
 * Root Packet ID: `0x03` (`3`)
 */
export class RemoveGamePacket extends BaseRootPacket {
  constructor(
    public disconnectReason?: DisconnectReason,
  ) {
    super(RootPacketType.RemoveGame);
  }

  static deserialize(reader: MessageReader): RemoveGamePacket {
    return new RemoveGamePacket(reader.hasBytesLeft() ? new DisconnectReason(reader.readByte()) : undefined);
  }

  clone(): RemoveGamePacket {
    return new RemoveGamePacket(this.disconnectReason?.clone());
  }

  serialize(writer: MessageWriter): void {
    if (this.disconnectReason) {
      writer.writeObject(this.disconnectReason);
    }
  }
}
