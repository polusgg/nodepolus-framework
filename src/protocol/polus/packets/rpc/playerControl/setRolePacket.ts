import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRpcPacket } from "../../../../packets/rpc";

export class SetRolePacket extends BaseRpcPacket {
  constructor(
    public roleId: number,
  ) {
    super(0x82);
  }

  static deserialize(reader: MessageReader): SetRolePacket {
    return new SetRolePacket(reader.readByte());
  }

  serialize(writer: MessageWriter): void {
    writer.writeByte(this.roleId);
  }

  clone(): SetRolePacket {
    return new SetRolePacket(this.roleId);
  }
}
