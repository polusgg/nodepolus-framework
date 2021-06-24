import { RpcPacketType } from "../../../types/enums";
import { MessageReader, MessageWriter } from "../../../util/hazelMessage";
import { BaseRpcPacket } from "./baseRpcPacket";

export class SubmergedAcknowledgeChangeFloorPacket extends BaseRpcPacket {
  constructor() {
    super(RpcPacketType.SubmergedAcknowledgeChangeFloor);
  }

  static deserialize(_reader: MessageReader): SubmergedAcknowledgeChangeFloorPacket {
    return new SubmergedAcknowledgeChangeFloorPacket();
  }

  clone(): SubmergedAcknowledgeChangeFloorPacket {
    return new SubmergedAcknowledgeChangeFloorPacket();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  serialize(_writer: MessageWriter): void {}
}
