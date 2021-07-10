import { BaseRootPacket } from "../../../packets/root";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";

export class DeleteGameOptionPacket extends BaseRootPacket {
  constructor(
    public sequenceId: number,
    public name: string,
  ) {
    super(0x8A);
  }

  static deserialize(reader: MessageReader): DeleteGameOptionPacket {
    return new DeleteGameOptionPacket(reader.readUInt16(), reader.readString());
  }

  serialize(writer: MessageWriter): void {
    writer.writeUInt16(this.sequenceId);
    writer.writeString(this.name);
  }

  clone(): DeleteGameOptionPacket {
    return new DeleteGameOptionPacket(this.sequenceId, this.name);
  }
}
