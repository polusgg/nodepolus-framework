import { MessageWriter, MessageReader } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class ClearVotePacket extends BaseRPCPacket {
  constructor() {
    super(RPCPacketType.ClearVote);
  }

  static deserialize(reader: MessageReader): ClearVotePacket {
    return new ClearVotePacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
