import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x01` (`1`)
 */
export class CompleteTaskPacket extends BaseRpcPacket {
  constructor(
    public readonly taskIndex: number,
  ) {
    super(RpcPacketType.CompleteTask);
  }

  static deserialize(reader: MessageReader): CompleteTaskPacket {
    return new CompleteTaskPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.taskIndex);
  }
}
