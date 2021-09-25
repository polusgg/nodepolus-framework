import { HazelMessage, MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType, Language, QuickChatMode } from "../../../types/enums";
import { ClientVersion } from "../../../types";
import { BaseHazelPacket } from ".";

/**
 * Hazel Packet ID: `0x08` (`8`)
 */
export class HelloPacket extends BaseHazelPacket {
  constructor(
    public hazelVersion: number,
    public clientVersion: ClientVersion,
    public name: string,
    public lastAuthNonce: number,
    public language: Language,
    public chatMode: QuickChatMode,
    public extraData: HazelMessage,
  ) {
    super(HazelPacketType.Hello);
  }

  static deserialize(reader: MessageReader): HelloPacket {
    return new HelloPacket(
      reader.readByte(),
      ClientVersion.decode(reader.readUInt32()),
      reader.readString(),
      reader.readUInt32(),
      reader.readUInt32(),
      reader.readByte(),
      reader.readRemainingBytes(),
    );
  }

  clone(): HelloPacket {
    return new HelloPacket(this.hazelVersion, this.clientVersion.clone(), this.name, this.lastAuthNonce, this.language, this.chatMode, this.extraData);
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.hazelVersion)
      .writeUInt32(this.clientVersion.encode())
      .writeString(this.name)
      .writeUInt32(this.language)
      .writeUInt32(this.lastAuthNonce)
      .writeByte(this.chatMode)
      .writeBytes(this.extraData);
  }
}
