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
    const position = Vector2.deserialize(reader);

    return new SnapToPacket(position, reader.readUInt16());
  }

  serialize(): MessageWriter {
    const writer = new MessageWriter();

    this.position.serialize(writer);

    return writer.writeUInt16(this.lastSequenceId);
  }
}
