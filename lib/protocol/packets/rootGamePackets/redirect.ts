import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRootGamePacket } from "../basePacket";
import { RootGamePacketType } from "../types";

export class RedirectPacket extends BaseRootGamePacket {
  constructor(
    public readonly ipAddress: string,
    public readonly port: number,
  ) {
    super(RootGamePacketType.Redirect);
  }

  static deserialize(reader: MessageReader): RedirectPacket {
    return new RedirectPacket(reader.readBytes(4).buffer.join("."), reader.readUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeBytes(this.ipAddress.split(".").map(octet => parseInt(octet, 10)))
      .writeUInt16(this.port);
  }
}
