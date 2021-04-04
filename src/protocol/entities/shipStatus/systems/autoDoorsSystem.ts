import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { Level, SystemType } from "../../../../types/enums";
import { Doors } from "../../../../static";
import { BaseSystem } from ".";

export class AutoDoorsSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
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

  serializeData(old: AutoDoorsSystem): MessageWriter {
    const writer = new MessageWriter();
    let mask = 0;
    const dirtyDoors: number[] = [];

    for (let i = 0; i < this.doorStates.length; i++) {
      if (old.doorStates[i] != this.doorStates[i]) {
        mask |= 1 << i;

        dirtyDoors.push(this.doorStates[i] ? 1 : 0);
      }
    }

    return writer.writePackedUInt32(mask).writeBytes(dirtyDoors);
  }

  serializeSpawn(): MessageWriter {
    const writer = new MessageWriter();

    for (let i = 0; i < this.doorStates.length; i++) {
      writer.writeBoolean(this.doorStates[i]);
    }

    return writer;
  }

  equals(old: AutoDoorsSystem): boolean {
    if (this.doorStates.length != old.doorStates.length) {
      return false;
    }

    for (let i = 0; i < this.doorStates.length; i++) {
      if (this.doorStates[i] != old.doorStates[i]) {
        return false;
      }
    }

    return true;
  }

  clone(): AutoDoorsSystem {
    return new AutoDoorsSystem(this.shipStatus, [...this.doorStates]);
  }
}
