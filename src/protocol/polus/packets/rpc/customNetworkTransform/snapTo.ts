import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRpcPacket } from "../../../../packets/rpc";
import { RpcPacketType } from "../../../../../types/enums";
import { Vector2 } from "../../../../../types";

/**
 * RPC Packet ID: `0x15` (`21`)
 */
export class CNTSnapToPacket extends BaseRpcPacket {
  constructor(
    public position: Vector2,
  ) {
    super(RpcPacketType.SnapTo);
  }

  static deserialize(reader: MessageReader): CNTSnapToPacket {
    return new CNTSnapToPacket(reader.readVector2());
  }

  clone(): CNTSnapToPacket {
    return new CNTSnapToPacket(this.position.clone());
  }

  serialize(writer: MessageWriter): void {
    writer.writeVector2(this.position);
  }
}
