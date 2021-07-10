import { BaseRootPacket } from "../../../../packets/root";
import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";

export class FetchResourceResponseStartedPacket extends BaseRootPacket {
  constructor(
    public readonly size: number,
  ) {
    super(0x00);
  }

  static deserialize(reader: MessageReader): FetchResourceResponseStartedPacket {
    return new FetchResourceResponseStartedPacket(reader.readPackedUInt32());
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.size);
  }

  clone(): FetchResourceResponseStartedPacket {
    return new FetchResourceResponseStartedPacket(this.size);
  }
}
