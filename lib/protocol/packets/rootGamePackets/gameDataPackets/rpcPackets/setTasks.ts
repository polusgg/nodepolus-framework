import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class SetTasksPacket extends BaseRPCPacket {
  // TODO: Leave tasks as a number[] or add a type for map-specific tasks and use that instead (e.g. LevelTask[])?
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
