import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { BaseRpcPacket } from ".";

/**
 * RPC Packet ID: `0x19` (`25`)
 */
export class ClearVotePacket extends BaseRpcPacket {
  constructor() {
    super(RpcPacketType.ClearVote);
  }

  static deserialize(_reader: MessageReader): ClearVotePacket {
    return new ClearVotePacket();
  }

  clone(): ClearVotePacket {
    return new ClearVotePacket();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serialize(_writer: MessageWriter): void {}
}
