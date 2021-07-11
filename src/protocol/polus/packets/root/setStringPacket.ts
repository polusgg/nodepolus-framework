import { BaseRootPacket } from "../../../packets/root";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { RootPacketType, StringLocation } from "../../../../types/enums";

export class SetStringPacket extends BaseRootPacket {
  constructor(
    public content: string,
    public location: StringLocation,
  ) {
    super(RootPacketType.PolusSetString);
  }

  static deserialize(reader: MessageReader): SetStringPacket {
    return new SetStringPacket(reader.readString(), reader.readByte());
  }

  serialize(writer: MessageWriter): MessageWriter {
    return writer.writeString(this.content).writeByte(this.location);
  }

  clone(): SetStringPacket {
    return new SetStringPacket(this.content, this.location);
  }
}
