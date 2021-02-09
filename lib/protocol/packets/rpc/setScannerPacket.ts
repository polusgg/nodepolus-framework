import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x0f` (`15`)
 */
export class SetScannerPacket extends BaseRpcPacket {
  constructor(
    public readonly isScanning: boolean,
    public readonly sequenceId: number,
  ) {
    super(RpcPacketType.SetScanner);
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
