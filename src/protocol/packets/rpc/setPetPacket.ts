import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerPet, RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x11` (`17`)
 */
export class SetPetPacket extends BaseRpcPacket {
  constructor(
    public pet: PlayerPet,
  ) {
    super(RpcPacketType.SetPet);
  }

  static deserialize(reader: MessageReader): SetPetPacket {
    return new SetPetPacket(reader.readPackedUInt32());
  }

  clone(): SetPetPacket {
    return new SetPetPacket(this.pet);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.pet);
  }
}
