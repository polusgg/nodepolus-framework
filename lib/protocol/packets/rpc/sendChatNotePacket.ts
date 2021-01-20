import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { ChatNoteType } from "../../../types/enums";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

/**
 * RPC Packet ID: `0x10` (`16`)
 */
export class SendChatNotePacket extends BaseRPCPacket {
  constructor(
    public readonly playerId: number,
    public readonly noteType: ChatNoteType,
  ) {
    super(RPCPacketType.SendChatNote);
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
