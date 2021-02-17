import { MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";

export abstract class BaseRpcPacket {
  constructor(
    public type: RpcPacketType,
  ) {}

  abstract clone(): BaseRpcPacket;

  abstract serialize(): MessageWriter;
}
