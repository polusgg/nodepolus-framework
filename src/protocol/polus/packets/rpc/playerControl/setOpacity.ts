import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRpcPacket } from "../../../../packets/rpc";

export class SetOpacityPacket extends BaseRpcPacket {
  constructor(
    public opacity: number,
  ) {
    super(0x8b);
  }

  static deserialize(reader: MessageReader): SetOpacityPacket {
    return new SetOpacityPacket(reader.readByte());
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.opacity);
  }

  clone(): SetOpacityPacket {
    return new SetOpacityPacket(this.opacity);
  }
}
