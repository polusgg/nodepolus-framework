import { BaseRootPacket } from "../../../packets/root";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { RootPacketType } from "../../../../types/enums";

export class DisplaySystemAlertPacket extends BaseRootPacket {
  constructor(
    public content: string,
  ) {
    super(RootPacketType.PolusDisplaySystemAlert);
  }

  static deserialize(reader: MessageReader): DisplaySystemAlertPacket {
    return new DisplaySystemAlertPacket(reader.readString());
  }

  serialize(writer: MessageWriter): void {
    writer.writeString(this.content);
  }

  clone(): DisplaySystemAlertPacket {
    return new DisplaySystemAlertPacket(this.content);
  }
}
