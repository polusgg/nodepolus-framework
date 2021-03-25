import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class SabotageSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected cooldown: number = 0,
  ) {
    super(shipStatus, SystemType.Sabotage);
  }

  getCooldown(): number {
    return this.cooldown;
  }

  setCooldown(seconds: number): this {
    this.cooldown = seconds;

    return this;
  }

  decrementCooldown(seconds: number = 1): this {
    this.cooldown -= Math.abs(seconds);

    if (this.cooldown < 0) {
      this.cooldown = 0;
    }

    return this;
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
