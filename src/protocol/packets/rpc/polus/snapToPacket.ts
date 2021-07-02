import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { BaseRpcPacket } from "../../../packets/rpc";
import { RpcPacketType } from "../../../../types/enums";
import { Vector2 } from "../../../../types";

/**
 * RPC Packet ID: `0x15` (`21`)
 * Modified in order to work with PolusGG client mod
 */
export class SnapToPacket extends BaseRpcPacket {
  constructor(
    public position: Vector2,
  ) {
    super(RpcPacketType.SnapTo);
  }

  static deserialize(reader: MessageReader): SnapToPacket {
    return new SnapToPacket(reader.readVector2());
  }

  clone(): SnapToPacket {
    return new SnapToPacket(this.position.clone());
  }

  serialize(writer: MessageWriter): void {
    writer.writeVector2(this.position);
  }
}
