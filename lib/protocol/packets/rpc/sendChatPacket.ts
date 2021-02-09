import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x0d` (`13`)
 */
export class SendChatPacket extends BaseRpcPacket {
  constructor(
    public readonly message: string,
  ) {
    super(RpcPacketType.SendChat);
  }

  static deserialize(reader: MessageReader): SendChatPacket {
    return new SendChatPacket(reader.readString());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeString(this.message);
  }
}
