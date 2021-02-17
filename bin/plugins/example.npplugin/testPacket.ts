import { MessageReader, MessageWriter } from "../../../lib/util/hazelMessage";
import { BaseRootPacket } from "../../../lib/protocol/packets/root";

export class TestPacket extends BaseRootPacket {
  constructor(
    public readonly message: string,
  ) {
    super(0x40);
  }

  static deserialize(reader: MessageReader): TestPacket {
    return new TestPacket(reader.readString());
  }

  clone(): TestPacket {
    return new TestPacket(this.message);
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeString(this.message);
  }
}
