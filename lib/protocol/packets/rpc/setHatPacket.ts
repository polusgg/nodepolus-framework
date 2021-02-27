import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerHat, RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x09` (`9`)
 */
export class SetHatPacket extends BaseRpcPacket {
  constructor(
    public hat: PlayerHat,
  ) {
    super(RpcPacketType.SetHat);
  }

  static deserialize(reader: MessageReader): SetHatPacket {
    return new SetHatPacket(reader.readPackedUInt32());
  }

  clone(): SetHatPacket {
    return new SetHatPacket(this.hat);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.hat);
  }
}
