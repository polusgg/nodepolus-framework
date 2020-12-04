import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class SendChatPacket extends BaseRPCPacket {
  constructor(
    public readonly message: string,
  ) {
    super(RPCPacketType.SendChat);
  }

  static deserialize(reader: MessageReader): SendChatPacket {
    return new SendChatPacket(reader.readString());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeString(this.message);
  }
}
