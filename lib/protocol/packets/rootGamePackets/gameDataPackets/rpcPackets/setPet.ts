import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { PlayerPet } from "../../../../../types/playerPet";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class SetPetPacket extends BaseRPCPacket {
  constructor(
    public readonly pet: PlayerPet,
  ) {
    super(RPCPacketType.SetPet);
  }

  static deserialize(reader: MessageReader): SetPetPacket {
    return new SetPetPacket(reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeByte(this.pet);
  }
}
