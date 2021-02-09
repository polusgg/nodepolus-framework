import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerColor } from "../../../types/enums";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x08` (`8`)
 */
export class SetColorPacket extends BaseRpcPacket {
  constructor(
    public readonly color: PlayerColor,
  ) {
    super(RpcPacketType.SetColor);
  }

  static deserialize(reader: MessageReader): SetColorPacket {
    return new SetColorPacket(reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.color);
  }
}
