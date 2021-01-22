import { MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { Bindable } from "../types";

export abstract class BaseRPCPacket implements Bindable<BaseRPCPacket> {
  public isClientBound?: boolean;

  constructor(
    public type: RPCPacketType,
  ) {}

  abstract serialize(): MessageWriter;

  bound(isClientBound: boolean): this {
    this.isClientBound = isClientBound;

    return this;
  }
}
