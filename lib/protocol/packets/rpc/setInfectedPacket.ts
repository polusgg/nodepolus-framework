import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

export class SetInfectedPacket extends BaseRPCPacket {
  constructor(
    public readonly impostorPlayerIds: number[],
  ) {
    super(RPCPacketType.SetInfected);
  }

  static deserialize(reader: MessageReader): SetInfectedPacket {
    return new SetInfectedPacket(reader.readList(impostors => impostors.readByte()));
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeList(this.impostorPlayerIds, (sub, id) => sub.writeByte(id));
  }
}
