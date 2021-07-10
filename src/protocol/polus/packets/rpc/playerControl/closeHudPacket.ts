import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRpcPacket } from "../../../../packets/rpc";

export class CloseHudPacket extends BaseRpcPacket {
  constructor() {
    super(0x83);
  }

  static deserialize(_reader: MessageReader): CloseHudPacket {
    return new CloseHudPacket();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serialize(_writer: MessageWriter): void {}

  clone(): CloseHudPacket {
    return new CloseHudPacket();
  }
}
