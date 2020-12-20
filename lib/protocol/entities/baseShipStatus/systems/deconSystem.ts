import { DecontaminationDoorState, SystemType } from "../../../../types/enums";
import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { BaseSystem } from ".";

export class DeconSystem extends BaseSystem<DeconSystem> {
  public timer = 0;
  public state: DecontaminationDoorState = DecontaminationDoorState.Idle;

  constructor() {
    super(SystemType.Decontamination);
  }

  static spawn(data: MessageReader): DeconSystem {
    const deconSystem = new DeconSystem();

    deconSystem.setSpawn(data);

    return deconSystem;
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter()
      .writeByte(this.timer)
      .writeByte(this.state);
  }

  setSpawn(data: MessageReader): void {
    this.timer = data.readByte();
    this.state = data.readByte();
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
    const clone = new DeconSystem();

    clone.state = this.state;
    clone.timer = this.timer;

    return clone;
  }
}
