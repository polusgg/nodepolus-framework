import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerSkin, RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x0a` (`10`)
 */
export class SetSkinPacket extends BaseRpcPacket {
  constructor(
    public skin: PlayerSkin,
  ) {
    super(RpcPacketType.SetSkin);
  }

  static deserialize(reader: MessageReader): SetSkinPacket {
    return new SetSkinPacket(reader.readPackedUInt32());
  }

  clone(): SetSkinPacket {
    return new SetSkinPacket(this.skin);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.skin);
  }
}
