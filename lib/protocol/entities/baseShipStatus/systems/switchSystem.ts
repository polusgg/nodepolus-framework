import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class SwitchSystem extends BaseSystem<SwitchSystem> {
  public actualSwitches: boolean[] = Array(5).fill(0).map(() => !!Math.round(Math.random() * 1));
  public expectedSwitches: boolean[] = this.actualSwitches;
  public visionModifier = 0xff;

  constructor() {
    super(SystemType.Electrical);
  }

  static spawn(data: MessageReader): SwitchSystem {
    const switchSystem = new SwitchSystem();

    switchSystem.setSpawn(data);

    return switchSystem;
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter()
      .writeBitfield(this.expectedSwitches)
      .writeBitfield(this.actualSwitches)
      .writeByte(this.visionModifier);
  }

  setSpawn(data: MessageReader): void {
    this.expectedSwitches = data.readBitfield(8).slice(3);
    this.actualSwitches = data.readBitfield(8).slice(3);
    this.visionModifier = data.readByte();
  }

  equals(old: SwitchSystem): boolean {
    for (let i = 0; i < this.actualSwitches.length; i++) {
      if (this.actualSwitches[i] != old.actualSwitches[i]) {
        return false;
      }
    }

    for (let i = 0; i < this.expectedSwitches.length; i++) {
      if (this.expectedSwitches[i] != old.expectedSwitches[i]) {
        return false;
      }
    }

    if (this.visionModifier != old.visionModifier) {
      return false;
    }

    return true;
  }
}
