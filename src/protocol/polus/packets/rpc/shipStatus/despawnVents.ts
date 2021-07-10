import { BaseRpcPacket } from "../../../../packets/rpc";
import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";

export class DespawnVentsPacket extends BaseRpcPacket {
  constructor(
    public vents: number[],
  ) {
    super(0x89);
  }

  static deserialize(reader: MessageReader): DespawnVentsPacket {
    return new DespawnVentsPacket([...reader.readBytesAndSize().getBuffer()]);
  }

  serialize(writer: MessageWriter): void {
    writer.writeBytesAndSize(this.vents);
  }

  clone(): DespawnVentsPacket {
    return new DespawnVentsPacket(this.vents);
  }
}
