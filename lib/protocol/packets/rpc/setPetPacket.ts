import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerPet } from "../../../types/enums";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x11` (`17`)
 */
export class SetPetPacket extends BaseRpcPacket {
  constructor(
    public readonly pet: PlayerPet,
  ) {
    super(RpcPacketType.SetPet);
  }

  static deserialize(reader: MessageReader): SetPetPacket {
    return new SetPetPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.pet);
  }
}
