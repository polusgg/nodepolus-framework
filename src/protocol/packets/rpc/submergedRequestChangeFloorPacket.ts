import { RpcPacketType } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRpcPacket } from "./baseRpcPacket";

export class SubmergedRequestChangeFloorPacket extends BaseRpcPacket {
  constructor(
    public toUpper: boolean,
    public lastSid: number,
  ) {
    super(RpcPacketType.SubmergedRequestChangeFloor);
  }

  static deserialize(reader: MessageReader): SubmergedRequestChangeFloorPacket {
    return new SubmergedRequestChangeFloorPacket(reader.readBoolean(), reader.readInt32());
  }

  clone(): SubmergedRequestChangeFloorPacket {
    return new SubmergedRequestChangeFloorPacket(this.toUpper, this.lastSid);
  }

  serialize(writer: MessageWriter): void {
    writer.writeBoolean(this.toUpper);
    writer.writeInt32(this.lastSid);
  }
}
