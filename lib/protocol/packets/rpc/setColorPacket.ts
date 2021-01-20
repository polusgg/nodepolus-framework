import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerColor } from "../../../types/enums";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

/**
 * RPC Packet ID: `0x08` (`8`)
 */
export class SetColorPacket extends BaseRPCPacket {
  constructor(
    public readonly color: PlayerColor,
  ) {
    super(RPCPacketType.SetColor);
  }

  static deserialize(reader: MessageReader): SetColorPacket {
    return new SetColorPacket(reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.color);
  }
}
