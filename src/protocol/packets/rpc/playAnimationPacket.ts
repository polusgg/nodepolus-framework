import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType, TaskType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x00` (`0`)
 */
export class PlayAnimationPacket extends BaseRpcPacket {
  constructor(
    public taskType: TaskType,
  ) {
    super(RpcPacketType.PlayAnimation);
  }

  static deserialize(reader: MessageReader): PlayAnimationPacket {
    return new PlayAnimationPacket(reader.readByte());
  }

  clone(): PlayAnimationPacket {
    return new PlayAnimationPacket(this.taskType);
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.taskType);
  }
}
