import { SystemType } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from "./baseSystem";

export class SubmergedSecuritySabotageSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected fixedCams: number[] = [],
  ) {
    super(shipStatus, SystemType.SubmergedSurveillanceSabotage);
  }

  clone(): SubmergedSecuritySabotageSystem {
    return new SubmergedSecuritySabotageSystem(this.shipStatus, [...this.fixedCams]);
  }

  equals(old: SubmergedSecuritySabotageSystem): boolean {
    if (this.fixedCams.length !== old.fixedCams.length) {
      return false;
    }

    for (let i = 0; i < this.fixedCams.length; i++) {
      if (this.fixedCams[i] !== old.fixedCams[i]) {
        return false;
      }
    }

    return true;
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeBytesAndSize(this.fixedCams);
  }
}
