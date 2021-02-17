import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x06` (`6`)
 */
export class SetNamePacket extends BaseRpcPacket {
  constructor(
    public name: string,
  ) {
    super(RpcPacketType.SetName);
  }

  static deserialize(reader: MessageReader): SetNamePacket {
    return new SetNamePacket(reader.readString());
  }

  clone(): SetNamePacket {
    return new SetNamePacket(this.name);
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeString(this.name);
  }
}
