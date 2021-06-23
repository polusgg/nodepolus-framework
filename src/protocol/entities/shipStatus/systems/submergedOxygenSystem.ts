import { SystemType } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from "./baseSystem";

export class SubmergedOxygenSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected duration: number = 10000,
  ) {
    super(shipStatus, SystemType.Oxygen);
  }

  getDuration(): number {
    return this.duration;
  }

  setDuration(duration: number): this {
    this.duration = duration;

    return this;
  }

  isSabotaged(): boolean {
    return this.duration < 10000;
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeFloat32(this.duration);
  }

  equals(old: SubmergedOxygenSystem): boolean {
    return this.duration === old.duration;
  }

  clone(): SubmergedOxygenSystem {
    return new SubmergedOxygenSystem(this.shipStatus, this.duration);
  }
}
