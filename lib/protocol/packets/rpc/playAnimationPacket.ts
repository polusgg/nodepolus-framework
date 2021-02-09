import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { TaskType } from "../../../types/enums";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x00` (`0`)
 */
export class PlayAnimationPacket extends BaseRpcPacket {
  constructor(
    public readonly taskType: TaskType,
  ) {
    super(RpcPacketType.PlayAnimation);
  }

  static deserialize(reader: MessageReader): PlayAnimationPacket {
    return new PlayAnimationPacket(reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.taskType);
  }
}
