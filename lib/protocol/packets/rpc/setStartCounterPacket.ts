import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

/**
 * RPC Packet ID: `0x12` (`18`)
 */
export class SetStartCounterPacket extends BaseRPCPacket {
  public readonly isReset: boolean;

  constructor(
    public readonly sequenceId: number,
    public readonly timeRemaining: number,
  ) {
    super(RPCPacketType.SetStartCounter);

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
