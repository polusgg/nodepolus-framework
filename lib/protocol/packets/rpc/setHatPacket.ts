import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { PlayerHat } from "../../../types/enums";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x09` (`9`)
 */
export class SetHatPacket extends BaseRpcPacket {
  constructor(
    public readonly hat: PlayerHat,
  ) {
    super(RpcPacketType.SetHat);
  }

  static deserialize(reader: MessageReader): SetHatPacket {
    return new SetHatPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.hat);
  }
}
