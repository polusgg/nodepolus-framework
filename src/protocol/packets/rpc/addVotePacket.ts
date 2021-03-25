import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x1a` (`26`)
 */
export class AddVotePacket extends BaseRpcPacket {
  constructor(
    public votingClientId: number,
    public targetClientId: number,
  ) {
    super(RpcPacketType.AddVote);
  }

  static deserialize(reader: MessageReader): AddVotePacket {
    return new AddVotePacket(reader.readUInt32(), reader.readUInt32());
  }

  clone(): AddVotePacket {
    return new AddVotePacket(this.votingClientId, this.targetClientId);
  }

  serialize(writer: MessageWriter): void {
    writer.writeUInt32(this.votingClientId).writeUInt32(this.targetClientId);
  }
}
