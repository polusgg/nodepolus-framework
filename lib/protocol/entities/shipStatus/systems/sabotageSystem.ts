import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class SabotageSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    // TODO: Make protected with getter/setter
    public cooldown: number = 0,
  ) {
    super(shipStatus, SystemType.Sabotage);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeFloat32(this.cooldown);
  }

  equals(old: SabotageSystem): boolean {
    if (this.cooldown != old.cooldown) {
      return false;
    }

    return true;
  }

  clone(): SabotageSystem {
    return new SabotageSystem(this.shipStatus, this.cooldown);
  }
}
