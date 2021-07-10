import { BaseRpcPacket } from "../../../../packets/rpc";
import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";

export class ChatVisibilityPacket extends BaseRpcPacket {
  constructor(
    public isVisible: boolean,
  ) {
    super(0x80);
  }

  static deserialize(reader: MessageReader): ChatVisibilityPacket {
    return new ChatVisibilityPacket(reader.readBoolean());
  }

  serialize(writer: MessageWriter): void {
    writer.writeBoolean(this.isVisible);
  }

  clone(): ChatVisibilityPacket {
    return new ChatVisibilityPacket(this.isVisible);
  }
}
