import { BaseRpcPacket } from "../../../../packets/rpc";
import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";

export class ClickPacket extends BaseRpcPacket {
  constructor() {
    super(0x86);
  }

  static deserialize(_reader: MessageReader): ClickPacket {
    return new ClickPacket();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serialize(_writer: MessageWriter): void {}

  clone(): ClickPacket {
    return new ClickPacket();
  }
}
