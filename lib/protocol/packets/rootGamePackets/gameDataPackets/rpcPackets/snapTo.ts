import { MessageWriter, MessageReader } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";
import { Vector2 } from "../../../../../util/vector2";

export class SnapToPacket extends BaseRPCPacket {
  constructor(public readonly position: Vector2, public readonly lastSequenceId: number) {
    super(RPCPacketType.SnapTo);
  }

  static deserialize(reader: MessageReader): SnapToPacket {
    let position = Vector2.deserialize(reader);

    return new SnapToPacket(position, reader.readUInt16());
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();

    this.position.serialize(writer);

    return writer.writeUInt16(this.lastSequenceId);
  }
}
