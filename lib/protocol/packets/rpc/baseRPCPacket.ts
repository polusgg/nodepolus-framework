import { MessageWriter } from "../../../util/hazelMessage";
import { RPCPacketType } from "../types/enums";
import { Bindable } from "../types";

export abstract class BaseRPCPacket implements Bindable<BaseRPCPacket> {
  public clientBound?: boolean;

  constructor(public type: RPCPacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}
