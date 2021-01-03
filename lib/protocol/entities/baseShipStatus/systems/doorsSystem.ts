import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemDoors } from "../../../../static/doors";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class DoorsSystem extends BaseSystem {
  public timers: Map<SystemType, number> = new Map<SystemType, number>();
  public doorStates: boolean[] = new Array(SystemDoors.polusCount).fill(true);

  constructor() {
    super(SystemType.Doors);
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.timers = new Map(data.readList(reader => [reader.readByte(), reader.readFloat32()]));

    for (let i = 0; i < SystemDoors.polusCount; i++) {
      this.doorStates[i] = data.readBoolean();
    }
  }

  getSpawn(): MessageWriter {
    const writer = new MessageWriter().writeList(this.timers, (sub, item) => {
      sub.writeByte(item[0]);
      sub.writeFloat32(item[1]);
    });

    for (let i = 0; i < SystemDoors.polusCount; i++) {
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
    const clone = new DoorsSystem();

    clone.doorStates = [...this.doorStates];
    clone.timers = new Map(this.timers);

    return clone;
  }
}
