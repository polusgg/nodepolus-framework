import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRpcPacket } from "../../../../packets/rpc";
import { RpcPacketType } from "../../../../../types/enums";
import { Vector2 } from "../../../../../types";

/**
 * RPC Packet ID: `0x15` (`21`)
 * Modified in order to work with PolusGG client mod
 */
export class PolusSnapToPacket extends BaseRpcPacket {
  constructor(
    public position: Vector2,
  ) {
    super(RpcPacketType.SnapTo);
  }

  static deserialize(reader: MessageReader): PolusSnapToPacket {
    return new PolusSnapToPacket(reader.readVector2());
  }

  clone(): PolusSnapToPacket {
    return new PolusSnapToPacket(this.position.clone());
  }

  serialize(writer: MessageWriter): void {
    writer.writeVector2(this.position);
  }
}
