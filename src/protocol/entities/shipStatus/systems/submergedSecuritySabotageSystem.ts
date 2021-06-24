import { SystemType } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from "./baseSystem";

export class SubmergedSecuritySabotageSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected fixedCams: Set<number> = new Set(),
  ) {
    super(shipStatus, SystemType.SubmergedSecuritySabotage);
  }

  clone(): SubmergedSecuritySabotageSystem {
    return new SubmergedSecuritySabotageSystem(this.shipStatus, new Set(this.fixedCams));
  }

  equals(old: SubmergedSecuritySabotageSystem): boolean {
    if (this.fixedCams.size !== old.fixedCams.size) {
      return false;
    }

    for (const value of this.fixedCams.values()) {
      if (!old.fixedCams.has(value)) {
        return false;
      }
    }

    return true;
  }

  fix(camera: number): void {
    this.fixedCams.add(camera);
  }

  break(camera: number): void {
    this.fixedCams.delete(camera);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeBytesAndSize([...this.fixedCams.values()]);
  }
}
