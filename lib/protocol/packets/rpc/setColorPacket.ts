import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerColor, RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x08` (`8`)
 */
export class SetColorPacket extends BaseRpcPacket {
  constructor(
    public color: PlayerColor,
  ) {
    super(RpcPacketType.SetColor);
  }

  static deserialize(reader: MessageReader): SetColorPacket {
    return new SetColorPacket(reader.readByte());
  }

  clone(): SetColorPacket {
    return new SetColorPacket(this.color);
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.color);
  }
}
