import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x01` (`1`)
 */
export class CompleteTaskPacket extends BaseRpcPacket {
  constructor(
    public taskIndex: number,
  ) {
    super(RpcPacketType.CompleteTask);
  }

  static deserialize(reader: MessageReader): CompleteTaskPacket {
    return new CompleteTaskPacket(reader.readPackedUInt32());
  }

  clone(): CompleteTaskPacket {
    return new CompleteTaskPacket(this.taskIndex);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.taskIndex);
  }
}
