import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRPCPacket } from "../basePacket";
import { RPCPacketType } from "../types";

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
