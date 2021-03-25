import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x1d` (`29`)
 */
export class SetTasksPacket extends BaseRpcPacket {
  constructor(
    public playerId: number,
    public tasks: number[],
  ) {
    super(RpcPacketType.SetTasks);
  }

  static deserialize(reader: MessageReader): SetTasksPacket {
    return new SetTasksPacket(
      reader.readByte(),
      reader.readList(tasks => tasks.readByte()),
    );
  }

  clone(): SetTasksPacket {
    return new SetTasksPacket(this.playerId, [...this.tasks]);
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.playerId)
      .writeList(this.tasks, (sub, task) => sub.writeByte(task));
  }
}
