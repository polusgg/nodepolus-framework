import { DecontaminationDoorState, SystemType } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from ".";

export class DeconTwoSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    // TODO: Make protected with getter/setter
    public timer: number = 0,
    // TODO: Make protected with getter/setter
    public state: DecontaminationDoorState = DecontaminationDoorState.Idle,
  ) {
    super(shipStatus, SystemType.Decontamination2);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.timer)
      .writeByte(this.state);
  }

  equals(old: DeconTwoSystem): boolean {
    if (this.timer != old.timer) {
      return false;
    }

    if (this.state != old.state) {
      return false;
    }

    return true;
  }

  clone(): DeconTwoSystem {
    return new DeconTwoSystem(this.shipStatus, this.timer, this.state);
  }
}
