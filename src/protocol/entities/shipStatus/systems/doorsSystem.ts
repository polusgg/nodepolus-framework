import { MessageWriter } from "../../../../util/hazelMessage";
import { Level, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { Doors } from "../../../../static";
import { BaseSystem } from ".";

export class DoorsSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected timers: Map<SystemType, number> = new Map(),
    protected doorStates: boolean[] = new Array(Doors.countForLevel(shipStatus.getLevel())).fill(true),
  ) {
    super(shipStatus, SystemType.Doors);

    if (shipStatus.getLevel() === Level.Airship) {
      this.doorStates[15] = false;
      this.doorStates[16] = false;
      this.doorStates[17] = false;
      this.doorStates[18] = false;
    }
  }

  getTimers(): Map<SystemType, number> {
    return this.timers;
  }

  setTimers(timers: Map<SystemType, number>): this {
    this.timers = timers;

    return this;
  }

  clearTimers(): this {
    this.timers.clear();

    return this;
  }

  getTimer(systemType: SystemType): number | undefined {
    return this.timers.get(systemType);
  }

  setTimer(systemType: SystemType, consoleId: number): this {
    this.timers.set(systemType, consoleId);

    return this;
  }

  removeTimer(systemType: SystemType): this {
    this.timers.delete(systemType);

    return this;
  }

  getDoorStates(): boolean[] {
    return this.doorStates;
  }

  setDoorStates(doorStates: boolean[]): this {
    this.doorStates = doorStates;

    return this;
  }

  getDoorState(index: number): boolean | undefined {
    return this.doorStates[index];
  }

  setDoorState(index: number, open: boolean): this {
    if (this.doorStates.length >= index) {
      this.doorStates[index] = open;
    }

    return this;
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    const writer = new MessageWriter().writeList(this.timers, (sub, item) => {
      sub.writeByte(item[0]);
      sub.writeFloat32(item[1]);
    });

    for (let i = 0; i < Doors.countForLevel(this.shipStatus.getLevel()); i++) {
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

    const timers = [...this.timers];

    for (let i = 0; i < timers.length; i++) {
      if (old.timers.get(timers[i][0]) != timers[i][1]) {
        return false;
      }
    }

    return true;
  }

  clone(): DoorsSystem {
    return new DoorsSystem(this.shipStatus, new Map(this.timers), [...this.doorStates]);
  }
}
