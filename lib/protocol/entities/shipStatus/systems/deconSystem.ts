import { DecontaminationDoorState, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus/baseInnerShipStatus";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseSystem } from ".";

export class DeconSystem extends BaseSystem {
  // TODO: Make protected with getter/setter
  public timer = 0;
  // TODO: Make protected with getter/setter
  public state: DecontaminationDoorState = DecontaminationDoorState.Idle;

  constructor(shipStatus: BaseInnerShipStatus) {
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
    const clone = new DeconSystem(this.shipStatus);

    clone.state = this.state;
    clone.timer = this.timer;

    return clone;
  }
}
