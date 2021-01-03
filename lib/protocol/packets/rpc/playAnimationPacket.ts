import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { TaskType } from "../../../types/enums";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

export class PlayAnimationPacket extends BaseRPCPacket {
  constructor(
    public readonly taskType: TaskType,
  ) {
    super(RPCPacketType.PlayAnimation);
  }

  static deserialize(reader: MessageReader): PlayAnimationPacket {
    return new PlayAnimationPacket(reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.taskType);
  }
}
