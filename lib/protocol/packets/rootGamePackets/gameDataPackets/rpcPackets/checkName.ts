import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class CheckNamePacket extends BaseRPCPacket {
  constructor(readonly name: string) {
    super(RPCPacketType.CheckName);
  }

  static deserialize(reader: MessageReader): CheckNamePacket {
    return new CheckNamePacket(reader.readString());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeString(this.name);
  }
}
