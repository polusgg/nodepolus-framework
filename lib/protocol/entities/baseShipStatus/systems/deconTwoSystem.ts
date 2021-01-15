import { DecontaminationDoorState, SystemType } from "../../../../types/enums";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { BaseSystem } from ".";
import { BaseInnerShipStatus } from "..";

export class DeconTwoSystem extends BaseSystem {
  public timer = 0;
  public state: DecontaminationDoorState = DecontaminationDoorState.Idle;

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.Decontamination2);
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.timer = data.readByte();
    this.state = data.readByte();
  }

  getSpawn(): MessageWriter {
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
    const clone = new DeconTwoSystem(this.shipStatus);

    clone.state = this.state;
    clone.timer = this.timer;

    return clone;
  }
}
