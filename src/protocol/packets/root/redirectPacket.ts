import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../../../types/enums";
import { BaseRootPacket } from ".";

/**
 * Root Packet ID: `0x0d` (`13`)
 */
export class RedirectPacket extends BaseRootPacket {
  constructor(
    public ipAddress: string,
    public port: number,
  ) {
    super(RootPacketType.Redirect);
  }

  static deserialize(reader: MessageReader): RedirectPacket {
    return new RedirectPacket(
      reader.readBytes(4).getBuffer().join("."),
      reader.readUInt16(),
    );
  }

  clone(): RedirectPacket {
    return new RedirectPacket(this.ipAddress, this.port);
  }

  serialize(writer: MessageWriter): void {
    writer.writeBytes(this.ipAddress.split(".").map(octet => parseInt(octet, 10)))
      .writeUInt16(this.port);
  }
}
