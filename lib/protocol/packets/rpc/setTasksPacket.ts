import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `1d` (`29`)
 */
export class SetTasksPacket extends BaseRpcPacket {
  constructor(
    public readonly playerId: number,
    public readonly tasks: number[],
  ) {
    super(RpcPacketType.SetTasks);
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
