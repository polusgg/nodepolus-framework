import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

/**
 * RPC Packet ID: `0x20` (`32`)
 */
export class UsePlatformPacket extends BaseRPCPacket {
  constructor() {
    super(RPCPacketType.UsePlatform);
  }

  static deserialize(_reader: MessageReader): UsePlatformPacket {
    return new UsePlatformPacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
