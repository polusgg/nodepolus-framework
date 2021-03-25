import { MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../../../types/enums";
import { CanSerializeToHazel } from "../../../types";

export abstract class BaseRpcPacket implements CanSerializeToHazel {
  constructor(
    protected readonly type: RpcPacketType,
  ) {}

  abstract clone(): BaseRpcPacket;

  abstract serialize(writer: MessageWriter): void;

  getType(): RpcPacketType {
    return this.type;
  }
}
