import { MessageReader, MessageWriter } from "../../../lib/util/hazelMessage";
import { BaseRpcPacket } from "../../../lib/protocol/packets/rpc";

export class TestRpcPacket extends BaseRpcPacket {
  constructor(
    public readonly message: string,
  ) {
    super(0x50);
  }

  static deserialize(reader: MessageReader): TestRpcPacket {
    return new TestRpcPacket(reader.readString());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeString(this.message);
  }
}
