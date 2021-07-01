import { RpcPacketType } from "../../../../types/enums";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { BaseRpcPacket } from "../baseRpcPacket";

export class SetAliveStatePacket extends BaseRpcPacket {
  constructor(
    public alive: boolean,
  ) {
    super(RpcPacketType.PolusSetAliveState);
  }

  static deserialize(reader: MessageReader): SetAliveStatePacket {
    return new SetAliveStatePacket(reader.readBoolean());
  }

  clone(): SetAliveStatePacket {
    return new SetAliveStatePacket(this.alive);
  }

  serialize(writer: MessageWriter): void {
    writer.writeBoolean(this.alive);
  }
}
