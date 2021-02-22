import { BaseInnerShipStatus } from "../baseShipStatus/baseInnerShipStatus";
import { MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/enums";

export abstract class BaseSystem {
  constructor(
    protected readonly shipStatus: BaseInnerShipStatus,
    protected readonly type: SystemType,
  ) {}

  abstract serializeData(old: this): MessageWriter;

  abstract serializeSpawn(): MessageWriter;

  abstract equals(old: BaseSystem): boolean;

  abstract clone(): BaseSystem;

  getShipStatus(): BaseInnerShipStatus {
    return this.shipStatus;
  }

  getType(): SystemType {
    return this.type;
  }
}
