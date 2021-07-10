import { BaseRpcPacket } from "../../../../packets/rpc";
import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";

export class UsePacket extends BaseRpcPacket {
  constructor() {
    super(0x84);
  }

  static deserialize(_reader: MessageReader): UsePacket {
    return new UsePacket();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serialize(_writer: MessageWriter): void {}

  clone(): UsePacket {
    return new UsePacket();
  }
}
