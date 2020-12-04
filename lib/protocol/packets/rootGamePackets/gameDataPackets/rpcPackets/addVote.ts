import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { BaseRPCPacket } from "../../../basePacket";
import { RPCPacketType } from "../../../types";

export class AddVotePacket extends BaseRPCPacket {
  constructor(
    public readonly votingClientId: number,
    public readonly targetClientId: number,
  ) {
    super(RPCPacketType.AddVote);
  }

  static deserialize(reader: MessageReader): AddVotePacket {
    return new AddVotePacket(reader.readUInt32(), reader.readUInt32());
  }

  serialize(): MessageWriter {
    return new MessageWriter().writeUInt32(this.votingClientId)
      .writeUInt32(this.targetClientId);
  }
}
