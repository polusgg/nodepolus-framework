import { BaseRootPacket } from "../../../packets/root";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";

export class ResizePacket extends BaseRootPacket {
  constructor(
    public readonly width: number,
    public readonly height: number,
  ) {
    super(0x81);
  }

  static deserialize(reader: MessageReader): ResizePacket {
    return new ResizePacket(reader.readPackedUInt32(), reader.readPackedUInt32());
  }

  serialize(writer: MessageWriter): void {
    writer
      .writePackedUInt32(this.width)
      .writePackedUInt32(this.height);
  }

  clone(): ResizePacket {
    return new ResizePacket(this.width, this.height);
  }
}
