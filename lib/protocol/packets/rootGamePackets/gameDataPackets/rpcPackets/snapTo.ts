import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { Vector2 } from "../../../../../util/vector2";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class SnapToPacket extends BaseRPCPacket {
  constructor(
    public readonly position: Vector2,
    public readonly lastSequenceId: number,
  ) {
    super(RPCPacketType.SnapTo);
  }

  static deserialize(reader: MessageReader): SnapToPacket {
    const position = Vector2.deserialize(reader);

    return new SnapToPacket(position, reader.readUInt16());
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    this.position.serialize(writer);

    return writer.writeUInt16(this.lastSequenceId);
  }
}
