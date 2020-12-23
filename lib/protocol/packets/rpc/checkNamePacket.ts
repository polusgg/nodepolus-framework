import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

export class CheckNamePacket extends BaseRPCPacket {
  constructor(
    public readonly name: string,
  ) {
    super(RPCPacketType.CheckName);
  }

  static deserialize(reader: MessageReader): CheckNamePacket {
    return new CheckNamePacket(reader.readString());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeString(this.name);
  }
}