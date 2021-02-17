import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { Vector2 } from "../../../types";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x15` (`21`)
 */
export class SnapToPacket extends BaseRpcPacket {
  constructor(
    public position: Vector2,
    public lastSequenceId: number,
  ) {
    super(RpcPacketType.SnapTo);
  }

  static deserialize(reader: MessageReader): SnapToPacket {
    return new SnapToPacket(reader.readVector2(), reader.readUInt16());
  }

  clone(): SnapToPacket {
    return new SnapToPacket(this.position.clone(), this.lastSequenceId);
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeVector2(this.position).writeUInt16(this.lastSequenceId);
  }
}
