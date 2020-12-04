import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class SetScannerPacket extends BaseRPCPacket {
  constructor(
    public readonly isScanning: boolean,
    public readonly sequenceId: number,
  ) {
    super(RPCPacketType.SetScanner);
  }

  static deserialize(reader: MessageReader): SetScannerPacket {
    return new SetScannerPacket(reader.readBoolean(), reader.readByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writeBoolean(this.isScanning)
      .writeByte(this.sequenceId);
  }
}
