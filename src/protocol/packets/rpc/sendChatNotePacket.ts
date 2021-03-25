import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { ChatNoteType, RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x10` (`16`)
 */
export class SendChatNotePacket extends BaseRpcPacket {
  constructor(
    public playerId: number,
    public chatNoteType: ChatNoteType,
  ) {
    super(RpcPacketType.SendChatNote);
  }

  static deserialize(reader: MessageReader): SendChatNotePacket {
    return new SendChatNotePacket(reader.readByte(), reader.readByte());
  }

  clone(): SendChatNotePacket {
    return new SendChatNotePacket(this.playerId, this.chatNoteType);
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.playerId).writeByte(this.chatNoteType);
  }
}
