import { MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType } from "../types/enums";
import { Bindable } from "../types";

export abstract class BaseHazelPacket implements Bindable<BaseHazelPacket> {
  public isClientBound?: boolean;

  constructor(
    public type: HazelPacketType,
  ) {}

  abstract serialize(): MessageWriter;

  bound(isClientBound: boolean): this {
    this.isClientBound = isClientBound;

    return this;
  }
}
