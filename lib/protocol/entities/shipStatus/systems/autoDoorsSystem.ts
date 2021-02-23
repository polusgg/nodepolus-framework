import { MessageWriter } from "../../../../util/hazelMessage";
import { Level, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { Doors } from "../../../../static";
import { BaseSystem } from ".";

export class AutoDoorsSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    // TODO: Make protected with getter/setter
    public doors: boolean[] = new Array(Doors.countForLevel(Level.TheSkeld)).fill(true),
  ) {
    super(shipStatus, SystemType.Doors);
  }

  serializeData(old: AutoDoorsSystem): MessageWriter {
    const writer = new MessageWriter();
    let mask = 0;
    const dirtyDoors: number[] = [];

    for (let i = 0; i < this.doors.length; i++) {
      if (old.doors[i] != this.doors[i]) {
        mask |= 1 << i;

        dirtyDoors.push(this.doors[i] ? 1 : 0);
      }
    }

    return writer.writePackedUInt32(mask).writeBytes(dirtyDoors);
  }

  serializeSpawn(): MessageWriter {
    const writer = new MessageWriter();

    for (let i = 0; i < this.doors.length; i++) {
      writer.writeBoolean(this.doors[i]);
    }

    return writer;
  }

  equals(old: AutoDoorsSystem): boolean {
    if (this.doors.length != old.doors.length) {
      return false;
    }

    for (let i = 0; i < this.doors.length; i++) {
      if (this.doors[i] != old.doors[i]) {
        return false;
      }
    }

    return true;
  }

  clone(): AutoDoorsSystem {
    return new AutoDoorsSystem(this.shipStatus, [...this.doors]);
  }
}
