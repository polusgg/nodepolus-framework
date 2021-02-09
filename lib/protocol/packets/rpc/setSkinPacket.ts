import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerSkin } from "../../../types/enums";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x0a` (`10`)
 */
export class SetSkinPacket extends BaseRpcPacket {
  constructor(
    public readonly skin: PlayerSkin,
  ) {
    super(RpcPacketType.SetSkin);
  }

  static deserialize(reader: MessageReader): SetSkinPacket {
    return new SetSkinPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.skin);
  }
}
