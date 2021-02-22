import { MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";

export abstract class BaseRpcPacket {
  constructor(
    protected readonly type: RpcPacketType,
  ) {}

  abstract clone(): BaseRpcPacket;

  abstract serialize(): MessageWriter;

  getType(): RpcPacketType {
    return this.type;
  }
}
