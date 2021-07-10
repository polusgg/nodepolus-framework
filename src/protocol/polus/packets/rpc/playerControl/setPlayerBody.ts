import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRpcPacket } from "../../../../packets/rpc";

export class SetPlayerBodyPacket extends BaseRpcPacket {
  constructor(
    public playerBody: number,
  ) {
    super(0x8a);
  }

  static deserialize(reader: MessageReader): SetPlayerBodyPacket {
    return new SetPlayerBodyPacket(reader.readPackedUInt32());
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.playerBody);
  }

  clone(): SetPlayerBodyPacket {
    return new SetPlayerBodyPacket(this.playerBody);
  }
}
