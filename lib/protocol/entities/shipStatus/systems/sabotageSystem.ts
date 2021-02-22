import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class SabotageSystem extends BaseSystem {
  // TODO: Make protected with getter/setter
  public cooldown = 0;

  constructor(shipStatus: BaseInnerShipStatus) {
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
    const clone = new SabotageSystem(this.shipStatus);

    clone.cooldown = this.cooldown;

    return clone;
  }
}
