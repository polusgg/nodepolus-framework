import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

export class SetTasksPacket extends BaseRPCPacket {
  constructor(
    public readonly playerId: number,
    public readonly tasks: number[],
  ) {
    super(RPCPacketType.SetTasks);
  }

  static deserialize(reader: MessageReader): SetTasksPacket {
    return new SetTasksPacket(reader.readByte(), reader.readList(tasks => tasks.readByte()));
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.playerId)
      .writeList(this.tasks, (sub, task) => sub.writeByte(task));
  }
}
