import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class SetNamePacket extends BaseRPCPacket {
  constructor(
    public readonly name: string,
  ) {
    super(RPCPacketType.SetName);
  }

  static deserialize(reader: MessageReader): SetNamePacket {
    return new SetNamePacket(reader.readString());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeString(this.name);
  }
}
