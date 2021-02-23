import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class HudOverrideSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    // TODO: Make protected with getter/setter
    public sabotaged: boolean = false,
  ) {
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
    return new HudOverrideSystem(this.shipStatus, this.sabotaged);
  }
}
