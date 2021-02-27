import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x20` (`32`)
 */
export class UsePlatformPacket extends BaseRpcPacket {
  constructor() {
    super(RpcPacketType.UsePlatform);
  }

  static deserialize(_reader: MessageReader): UsePlatformPacket {
    return new UsePlatformPacket();
  }

  clone(): UsePlatformPacket {
    return new UsePlatformPacket();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serialize(_writer: MessageWriter): void {}
}
