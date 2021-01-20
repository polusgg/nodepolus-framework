import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerSkin } from "../../../types/enums";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

/**
 * RPC Packet ID: `0x0a` (`10`)
 */
export class SetSkinPacket extends BaseRPCPacket {
  constructor(
    public readonly skin: PlayerSkin,
  ) {
    super(RPCPacketType.SetSkin);
  }

  static deserialize(reader: MessageReader): SetSkinPacket {
    return new SetSkinPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.skin);
  }
}
