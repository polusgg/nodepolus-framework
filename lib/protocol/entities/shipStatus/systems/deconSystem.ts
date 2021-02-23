import { DecontaminationDoorState, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus/baseInnerShipStatus";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseSystem } from ".";

export class DeconSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected timer: number = 0,
    protected state: DecontaminationDoorState = DecontaminationDoorState.Idle,
  ) {
    super(shipStatus, SystemType.Decontamination);
  }

  getTimer(): number {
    return this.timer;
  }

  setTimer(seconds: number): this {
    this.timer = seconds;

    return this;
  }

  decrementTimer(seconds: number = 1): this {
    this.timer -= Math.abs(seconds);

    if (this.timer < 0) {
      this.timer = 0;
    }

    return this;
  }

  getState(): DecontaminationDoorState {
    return this.state;
  }

  setState(state: DecontaminationDoorState): this {
    this.state = state;

    return this;
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
