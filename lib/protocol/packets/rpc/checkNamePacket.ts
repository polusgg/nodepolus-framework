import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x05` (`5`)
 */
export class CheckNamePacket extends BaseRpcPacket {
  constructor(
    public name: string,
  ) {
    super(RpcPacketType.CheckName);
  }

  static deserialize(reader: MessageReader): CheckNamePacket {
    return new CheckNamePacket(reader.readString());
  }

  clone(): CheckNamePacket {
    return new CheckNamePacket(this.name);
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeString(this.name);
  }
}
