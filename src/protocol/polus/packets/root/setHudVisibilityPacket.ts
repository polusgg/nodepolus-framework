import { BaseRootPacket } from "../../../packets/root";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { HudItem, RootPacketType } from "../../../../types/enums";

export class SetHudVisibilityPacket extends BaseRootPacket {
  constructor(
    public item: HudItem,
    public enabled: boolean,
  ) {
    super(RootPacketType.PolusSetHudVisibility);
  }

  static deserialize(reader: MessageReader): SetHudVisibilityPacket {
    return new SetHudVisibilityPacket(reader.readByte(), reader.readBoolean());
  }

  serialize(writer: MessageWriter): MessageWriter {
    return writer.writeByte(this.item).writeBoolean(this.enabled);
  }

  clone(): SetHudVisibilityPacket {
    return new SetHudVisibilityPacket(this.item, this.enabled);
  }
}
