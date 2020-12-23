import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

export class CompleteTaskPacket extends BaseRPCPacket {
  constructor(
    public readonly taskIndex: number,
  ) {
    super(RPCPacketType.CompleteTask);
  }

  static deserialize(reader: MessageReader): CompleteTaskPacket {
    return new CompleteTaskPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.taskIndex);
  }
}