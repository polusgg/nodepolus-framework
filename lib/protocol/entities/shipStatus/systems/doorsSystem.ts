import { MessageWriter } from "../../../../util/hazelMessage";
import { Level, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { Doors } from "../../../../static";
import { BaseSystem } from ".";

export class DoorsSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    // TODO: Make protected with getter/setter
    public timers: Map<SystemType, number> = new Map<SystemType, number>(),
    // TODO: Make protected with getter/setter
    public doorStates: boolean[] = new Array(Doors.countForLevel(Level.Polus)).fill(true),
  ) {
    super(shipStatus, SystemType.Doors);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    const writer = new MessageWriter().writeList(this.timers, (sub, item) => {
      sub.writeByte(item[0]);
      sub.writeFloat32(item[1]);
    });

    for (let i = 0; i < Doors.countForLevel(Level.Polus); i++) {
      writer.writeBoolean(this.doorStates[i]);
    }

    return writer;
  }

  equals(old: DoorsSystem): boolean {
    if (this.timers.size != old.timers.size) {
      return false;
    }

    if (this.doorStates.length != old.doorStates.length) {
      return false;
    }

    for (let i = 0; i < this.doorStates.length; i++) {
      if (this.doorStates[i] != old.doorStates[i]) {
        return false;
      }
    }

    const timerArray = [...this.timers.values()];
    const oldTimerArray = [...old.timers.values()];

    for (let i = 0; i < timerArray.length; i++) {
      if (timerArray[i] != oldTimerArray[i]) {
        return false;
      }
    }

    return true;
  }

  clone(): DoorsSystem {
    return new DoorsSystem(this.shipStatus, new Map(this.timers), [...this.doorStates]);
  }
}
