import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class ClearVotePacket extends BaseRPCPacket {
  constructor() {
    super(RPCPacketType.ClearVote);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static deserialize(_reader: MessageReader): ClearVotePacket {
    return new ClearVotePacket();
  }

  serialize(): MessageWriter {
    return new MessageWriter();
  }
}
