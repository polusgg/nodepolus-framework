import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x12` (`18`)
 */
export class SetStartCounterPacket extends BaseRpcPacket {
  constructor(
    public sequenceId: number,
    public timeRemaining: number,
  ) {
    super(RpcPacketType.SetStartCounter);
  }

  static deserialize(reader: MessageReader): SetStartCounterPacket {
    return new SetStartCounterPacket(reader.readPackedUInt32(), reader.readSByte());
  }

  clone(): SetStartCounterPacket {
    return new SetStartCounterPacket(this.sequenceId, this.timeRemaining);
  }

  serialize(): MessageWriter {
    return new MessageWriter()
      .writePackedUInt32(this.sequenceId)
      .writeSByte(this.timeRemaining);
  }

  isReset(): boolean {
    return this.timeRemaining == 0xff;
  }
}
