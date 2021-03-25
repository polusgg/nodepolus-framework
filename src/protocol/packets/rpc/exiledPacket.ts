import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x04` (`4`)
 */
export class ExiledPacket extends BaseRpcPacket {
  constructor() {
    super(RpcPacketType.Exiled);
  }

  static deserialize(_reader: MessageReader): ExiledPacket {
    return new ExiledPacket();
  }

  clone(): ExiledPacket {
    return new ExiledPacket();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serialize(_writer: MessageWriter): void {}
}
