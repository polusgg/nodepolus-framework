import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x0c` (`12`)
 */
export class MurderPlayerPacket extends BaseRpcPacket {
  constructor(
    public victimPlayerControlNetId: number,
  ) {
    super(RpcPacketType.MurderPlayer);
  }

  static deserialize(reader: MessageReader): MurderPlayerPacket {
    return new MurderPlayerPacket(reader.readPackedUInt32());
  }

  clone(): MurderPlayerPacket {
    return new MurderPlayerPacket(this.victimPlayerControlNetId);
  }

  serialize(writer: MessageWriter): void {
    writer.writePackedUInt32(this.victimPlayerControlNetId);
  }
}
