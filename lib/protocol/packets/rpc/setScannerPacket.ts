import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

/**
 * RPC Packet ID: `0x0f` (`15`)
 */
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
