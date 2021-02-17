import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerColor } from "../../../types/enums";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x07` (`7`)
 */
export class CheckColorPacket extends BaseRpcPacket {
  constructor(
    public color: PlayerColor,
  ) {
    super(RpcPacketType.CheckColor);
  }

  static deserialize(reader: MessageReader): CheckColorPacket {
    return new CheckColorPacket(reader.readByte());
  }

  clone(): CheckColorPacket {
    return new CheckColorPacket(this.color);
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.color);
  }
}
