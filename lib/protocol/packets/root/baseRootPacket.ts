import { MessageWriter } from "../../../util/hazelMessage";
import { RootPacketType } from "../types/enums";
import { Bindable } from "../types";

export abstract class BaseRootPacket implements Bindable<BaseRootPacket> {
  public clientBound?: boolean;

  constructor(public type: RootPacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}
