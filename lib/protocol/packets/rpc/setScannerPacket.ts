import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x0f` (`15`)
 */
export class SetScannerPacket extends BaseRpcPacket {
  constructor(
    public isScanning: boolean,
    public sequenceId: number,
  ) {
    super(RpcPacketType.SetScanner);
  }

  static deserialize(reader: MessageReader): SetScannerPacket {
    return new SetScannerPacket(reader.readBoolean(), reader.readByte());
  }

  clone(): SetScannerPacket {
    return new SetScannerPacket(this.isScanning, this.sequenceId);
  }

  serialize(writer: MessageWriter): void {
    writer.writeBoolean(this.isScanning).writeByte(this.sequenceId);
  }
}
