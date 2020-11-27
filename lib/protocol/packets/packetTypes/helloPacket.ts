import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { ClientVersion } from "../../../util/clientVersion";
import { BasePacket } from "../basePacket";
import { PacketType } from "../types";

export class HelloPacket extends BasePacket {
  constructor(
    public nonce: number,
    public hazelVersion: number,
    public clientVersion: ClientVersion,
    public name: string
  ) {
    super(PacketType.Hello);
  }

  static deserialize(reader: MessageReader): HelloPacket {
    return new HelloPacket(
      reader.readUInt16(true),
      reader.readByte(),
      ClientVersion.decode(reader.readUInt32()),
      reader.readString()
    );
  }

  serialize(): MessageWriter {
    let writer = new MessageWriter();

    writer.writeUInt16(this.nonce);
    writer.writeByte(this.hazelVersion);
    writer.writeUInt32(this.clientVersion.encode());
    writer.writeString(this.name);

    return writer;
  }
}
