import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRpcPacket } from "../../../../packets/rpc";

export class RevivePacket extends BaseRpcPacket {
  constructor() {
    super(0x84);
  }

  static deserialize(_reader: MessageReader): RevivePacket {
    return new RevivePacket();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serialize(_writer: MessageWriter): void {}

  clone(): RevivePacket {
    return new RevivePacket();
  }
}
