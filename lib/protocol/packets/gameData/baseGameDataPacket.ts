import { MessageWriter } from "../../../util/hazelMessage";
import { GameDataPacketType } from "../types/enums";
import { Bindable } from "../types";

export abstract class BaseGameDataPacket implements Bindable<BaseGameDataPacket> {
  public isClientBound?: boolean;

  constructor(public type: GameDataPacketType) {}

  abstract serialize(): MessageWriter;

  bound(isClientBound: boolean): this {
    this.isClientBound = isClientBound;

    return this;
  }
}
