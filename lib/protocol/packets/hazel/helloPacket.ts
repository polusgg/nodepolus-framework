import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType } from "../types/enums";
import { ClientVersion } from "../../../types";
import { BaseHazelPacket } from ".";

export class HelloPacket extends BaseHazelPacket {
  constructor(
    public hazelVersion: number,
    public clientVersion: ClientVersion,
    public name: string,
  ) {
    super(HazelPacketType.Hello);
  }

  static deserialize(reader: MessageReader): HelloPacket {
    return new HelloPacket(
      reader.readByte(),
      ClientVersion.decode(reader.readUInt32()),
      reader.readString(),
    );
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.hazelVersion)
      .writeUInt32(this.clientVersion.encode())
      .writeString(this.name);
  }
}
