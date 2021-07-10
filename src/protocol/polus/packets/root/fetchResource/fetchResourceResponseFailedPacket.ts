import { BaseRootPacket } from "../../../../packets/root";
import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { DownloadFailureReason } from "../../../../../types/enums";

export class FetchResourceResponseFailedPacket extends BaseRootPacket {
  constructor(
    public readonly reason: DownloadFailureReason,
  ) {
    super(0x02);
  }

  static deserialize(reader: MessageReader): FetchResourceResponseFailedPacket {
    return new FetchResourceResponseFailedPacket(reader.readPackedUInt32());
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.reason);
  }

  clone(): FetchResourceResponseFailedPacket {
    return new FetchResourceResponseFailedPacket(this.reason);
  }
}
