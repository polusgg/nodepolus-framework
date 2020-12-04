import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { PlayerSkin } from "../../../../../types/playerSkin";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class SetSkinPacket extends BaseRPCPacket {
  constructor(
    public readonly skin: PlayerSkin,
  ) {
    super(RPCPacketType.SetSkin);
  }

  static deserialize(reader: MessageReader): SetSkinPacket {
    return new SetSkinPacket(reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.skin);
  }
}
