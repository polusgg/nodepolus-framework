import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/enums";
import { Bitfield } from "../../../../types";
import { BaseSystem } from ".";

export class SwitchSystem extends BaseSystem {
  public actualSwitches: Bitfield = new Bitfield(Array(5).fill(0).map(() => !!Math.round(Math.random() * 1)));
  public expectedSwitches: Bitfield = this.actualSwitches;
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
      .writeByte(this.expectedSwitches.toNumber())
      .writeByte(this.actualSwitches.toNumber())
      .writeByte(this.visionModifier);
  }

  setSpawn(data: MessageReader): void {
    this.expectedSwitches = Bitfield.fromNumber(data.readByte(), 5);
    this.actualSwitches = Bitfield.fromNumber(data.readByte(), 5);
    this.visionModifier = data.readByte();
  }

  equals(old: SwitchSystem): boolean {
    for (let i = 0; i < this.actualSwitches.bits.length; i++) {
      if (this.actualSwitches.bits[i] != old.actualSwitches.bits[i]) {
        return false;
      }
    }

    for (let i = 0; i < this.expectedSwitches.bits.length; i++) {
      if (this.expectedSwitches.bits[i] != old.expectedSwitches.bits[i]) {
        return false;
      }
    }

    if (this.visionModifier != old.visionModifier) {
      return false;
    }

    return true;
  }

  clone(): SwitchSystem {
    const clone = new SwitchSystem();

    clone.actualSwitches = new Bitfield(this.actualSwitches.bits);
    clone.expectedSwitches = new Bitfield(this.expectedSwitches.bits);
    clone.visionModifier = this.visionModifier;

    return clone;
  }
}
