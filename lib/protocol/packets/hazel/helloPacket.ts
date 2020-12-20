import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { ClientVersion } from "../../../util/clientVersion";
import { BasePacket } from "../basePacket";
import { PacketType } from "../types";

export class HelloPacket extends BasePacket {
  constructor(public hazelVersion: number, public clientVersion: ClientVersion, public name: string) {
    super(PacketType.Hello);
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
