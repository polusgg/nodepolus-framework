import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x16` (`22`)
 */
export class ClosePacket extends BaseRpcPacket {
  constructor() {
    super(RpcPacketType.Close);
  }

  static deserialize(_reader: MessageReader): ClosePacket {
    return new ClosePacket();
  }

  clone(): ClosePacket {
    return new ClosePacket();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serialize(_writer: MessageWriter): void {}
}
