import { MessageWriter } from "../../../util/hazelMessage";
import { GameDataPacketType } from "../types/enums";
import { Bindable } from "../types";

export abstract class BaseGameDataPacket implements Bindable<BaseGameDataPacket> {
  public clientBound?: boolean;

  constructor(public type: GameDataPacketType) {}

  abstract serialize(): MessageWriter;

  bound(clientBound: boolean): this {
    this.clientBound = clientBound;

    return this;
  }
}
