import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class HudOverrideSystem extends BaseSystem {
  // TODO: Make protected with getter/setter
  public sabotaged = false;

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.Communications);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeBoolean(this.sabotaged);
  }

  equals(old: HudOverrideSystem): boolean {
    return this.sabotaged == old.sabotaged;
  }

  clone(): HudOverrideSystem {
    const clone = new HudOverrideSystem(this.shipStatus);

    clone.sabotaged = this.sabotaged;

    return clone;
  }
}
