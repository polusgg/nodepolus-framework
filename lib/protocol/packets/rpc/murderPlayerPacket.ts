import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

export class MurderPlayerPacket extends BaseRPCPacket {
  constructor(
    public readonly victimPlayerControlNetId: number,
  ) {
    super(RPCPacketType.MurderPlayer);
  }

  static deserialize(reader: MessageReader): MurderPlayerPacket {
    return new MurderPlayerPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.victimPlayerControlNetId);
  }
}
