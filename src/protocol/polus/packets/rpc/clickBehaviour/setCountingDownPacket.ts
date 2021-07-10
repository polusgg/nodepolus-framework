import { BaseRpcPacket } from "../../../../packets/rpc";
import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";

export class SetCountingDownPacket extends BaseRpcPacket {
  constructor(
    public requestCounting: boolean,
    public currentTimer: number,
  ) {
    super(0x90);
  }

  static deserialize(reader: MessageReader): SetCountingDownPacket {
    return new SetCountingDownPacket(
      reader.readBoolean(),
      reader.readFloat32(),
    );
  }

  serialize(writer: MessageWriter): void {
    writer.writeBoolean(this.requestCounting);
    writer.writeFloat32(this.currentTimer);
  }

  clone(): SetCountingDownPacket {
    return new SetCountingDownPacket(this.requestCounting, this.currentTimer);
  }
}
