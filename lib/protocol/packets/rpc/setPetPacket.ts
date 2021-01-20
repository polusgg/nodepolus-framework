import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerPet } from "../../../types/enums";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

/**
 * RPC Packet ID: `0x11` (`17`)
 */
export class SetPetPacket extends BaseRPCPacket {
  constructor(
    public readonly pet: PlayerPet,
  ) {
    super(RPCPacketType.SetPet);
  }

  static deserialize(reader: MessageReader): SetPetPacket {
    return new SetPetPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.pet);
  }
}
