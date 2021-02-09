import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
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

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
