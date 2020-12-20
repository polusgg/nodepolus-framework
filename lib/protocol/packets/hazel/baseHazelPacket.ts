import { MessageWriter } from "../../../util/hazelMessage";
import { HazelPacketType } from "../types/enums";
import { Bindable } from "../types";

export abstract class BaseHazelPacket implements Bindable<BaseHazelPacket> {
  public clientBound?: boolean;

  constructor(public type: HazelPacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}
