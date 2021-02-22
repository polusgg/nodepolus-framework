import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus/baseInnerShipStatus";
import { SystemType } from "../../../../types/enums";

export abstract class BaseSystem {
  constructor(
    // TODO: Make protected with getter
    public readonly shipStatus: BaseInnerShipStatus,
    // TODO: Make protected with getter
    public readonly type: SystemType,
  ) {}

  abstract getData(old: this): MessageWriter;

  abstract setData(packet: MessageReader): void;

  abstract getSpawn(): MessageWriter;

  abstract equals(old: BaseSystem): boolean;

  abstract clone(): BaseSystem;

  data(packet: MessageReader): undefined;
  data(old: this): MessageWriter;
  data(arg0: MessageReader | this): MessageWriter | undefined {
    if (arg0 instanceof MessageReader) {
      this.setData(arg0);
    } else {
      return this.getData(arg0);
    }
  }
}
