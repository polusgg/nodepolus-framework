import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class PlayAnimationPacket extends BaseRPCPacket {
  constructor(public readonly taskId: number) {
    super(RPCPacketType.PlayAnimation);
  }

  static deserialize(reader: MessageReader): PlayAnimationPacket {
    return new PlayAnimationPacket(reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.taskId);
  }
}
