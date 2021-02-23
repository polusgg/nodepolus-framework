import { DecontaminationDoorState, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus/baseInnerShipStatus";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseSystem } from ".";

export class DeconSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    // TODO: Make protected with getter/setter
    public timer: number = 0,
    // TODO: Make protected with getter/setter
    public state: DecontaminationDoorState = DecontaminationDoorState.Idle,
  ) {
    super(shipStatus, SystemType.Decontamination);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.timer)
      .writeByte(this.state);
  }

  equals(old: DeconSystem): boolean {
    if (this.timer != old.timer) {
      return false;
    }

    if (this.state != old.state) {
      return false;
    }

    return true;
  }

  clone(): DeconSystem {
    return new DeconSystem(this.shipStatus, this.timer, this.state);
  }
}
