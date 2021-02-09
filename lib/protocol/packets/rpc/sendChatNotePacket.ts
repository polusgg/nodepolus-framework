import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { ChatNoteType } from "../../../types/enums";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x10` (`16`)
 */
export class SendChatNotePacket extends BaseRpcPacket {
  constructor(
    public readonly playerId: number,
    public readonly noteType: ChatNoteType,
  ) {
    super(RpcPacketType.SendChatNote);
  }

  static deserialize(reader: MessageReader): SendChatNotePacket {
    return new SendChatNotePacket(reader.readByte(), reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.playerId)
      .writeByte(this.noteType);
  }
}
