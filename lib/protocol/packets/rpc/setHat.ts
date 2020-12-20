import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerHat } from "../../../types/enums";
import { BaseRPCPacket } from "../basePacket";
import { RPCPacketType } from "../types";

export class SetHatPacket extends BaseRPCPacket {
  constructor(
    public readonly hat: PlayerHat,
  ) {
    super(RPCPacketType.SetHat);
  }

  static deserialize(reader: MessageReader): SetHatPacket {
    return new SetHatPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.hat);
  }
}
