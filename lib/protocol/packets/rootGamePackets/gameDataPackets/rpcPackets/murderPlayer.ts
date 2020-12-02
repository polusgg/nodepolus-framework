import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class MurderPlayerPacket extends BaseRPCPacket {
  constructor(public readonly victimPlayerControlNetId: number) {
    super(RPCPacketType.MurderPlayer);
  }

  static deserialize(reader: MessageReader): MurderPlayerPacket {
    return new MurderPlayerPacket(reader.readPackedUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writePackedUInt32(this.victimPlayerControlNetId);
  }
}
