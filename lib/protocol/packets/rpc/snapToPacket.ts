import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { Vector2 } from "../../../types";
import { BaseRPCPacket } from ".";

export class SnapToPacket extends BaseRPCPacket {
  constructor(
    public readonly position: Vector2,
    public readonly lastSequenceId: number,
  ) {
    super(RPCPacketType.SnapTo);
  }

  static deserialize(reader: MessageReader): SnapToPacket {
    return new SnapToPacket(reader.readVector2(), reader.readUInt16());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeVector2(this.position).writeUInt16(this.lastSequenceId);
  }
}
