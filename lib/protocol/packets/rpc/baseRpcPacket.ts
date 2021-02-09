import { MessageWriter } from "../../../util/hazelMessage";
import { RpcPacketType } from "../types/enums";
import { Bindable } from "../types";

export abstract class BaseRpcPacket implements Bindable<BaseRpcPacket> {
  public isClientBound?: boolean;

  constructor(
    public type: RpcPacketType,
  ) {}

  abstract serialize(): MessageWriter;

  bound(isClientBound: boolean): this {
    this.isClientBound = isClientBound;

    return this;
  }
}
