import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class HudOverrideSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected sabotaged: boolean = false,
  ) {
    super(shipStatus, SystemType.Communications);
  }

  isSabotaged(): boolean {
    return this.sabotaged;
  }

  setSabotaged(sabotaged: boolean): this {
    this.sabotaged = sabotaged;

    return this;
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
