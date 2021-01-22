import { MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../types/enums";
import { Bindable } from "../types";

export abstract class BaseRootPacket implements Bindable<BaseRootPacket> {
  public isClientBound?: boolean;

  constructor(
    public type: RootPacketType,
  ) {}

  abstract serialize(): MessageWriter;

  bound(isClientBound: boolean): this {
    this.isClientBound = isClientBound;

    return this;
  }
}
