import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { BaseRPCPacket } from ".";

/**
 * RPC Packet ID: `0x19` (`25`)
 */
export class ClearVotePacket extends BaseRPCPacket {
  constructor() {
    super(RPCPacketType.ClearVote);
  }

  static deserialize(_reader: MessageReader): ClearVotePacket {
    return new ClearVotePacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
