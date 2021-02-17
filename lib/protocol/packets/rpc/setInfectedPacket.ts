import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x03` (`3`)
 */
export class SetInfectedPacket extends BaseRpcPacket {
  constructor(
    public impostorPlayerIds: number[],
  ) {
    super(RpcPacketType.SetInfected);
  }

  static deserialize(reader: MessageReader): SetInfectedPacket {
    return new SetInfectedPacket(reader.readList(impostors => impostors.readByte()));
  }

  clone(): SetInfectedPacket {
    return new SetInfectedPacket([...this.impostorPlayerIds]);
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeList(this.impostorPlayerIds, (sub, id) => sub.writeByte(id));
  }
}
