import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x12` (`18`)
 */
export class SetStartCounterPacket extends BaseRpcPacket {
  public readonly isReset: boolean;

  constructor(
    public readonly sequenceId: number,
    public readonly timeRemaining: number,
  ) {
    super(RpcPacketType.SetStartCounter);

    this.isReset = this.timeRemaining == 0xff;
  }

  static deserialize(reader: MessageReader): SetStartCounterPacket {
    return new SetStartCounterPacket(reader.readPackedUInt32(), reader.readSByte());
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.sequenceId)
      .writeSByte(this.timeRemaining);
  }
}
