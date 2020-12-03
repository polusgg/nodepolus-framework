import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { POLUS_DOOR_COUNT } from "../../../../util/constants";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class DoorsSystem extends BaseSystem<DoorsSystem> {
  public timers: Map<SystemType, number> = new Map<SystemType, number>();
  public doorStates: boolean[] = Array(POLUS_DOOR_COUNT).fill(false);

  constructor() {
    super(SystemType.Doors);
  }

  static spawn(data: MessageReader): DoorsSystem {
    const doorsSystem = new DoorsSystem();

    doorsSystem.setSpawn(data);

    return doorsSystem;
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    const writer = new MessageWriter().writeList(this.timers, (sub, item) => {
      sub.writeByte(item[0]);
      sub.writeFloat32(item[1]);
    });

    for (let i = 0; i < POLUS_DOOR_COUNT; i++) {
      writer.writeBoolean(this.doorStates[i]);
    }

    return writer;
  }

  setSpawn(data: MessageReader): void {
    this.timers = new Map(data.readList(reader => [reader.readByte(), reader.readFloat32()]));

    for (let i = 0; i < POLUS_DOOR_COUNT; i++) {
      this.doorStates[i] = data.readBoolean();
    }
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

    const timerArray = [ ...this.timers.values() ];
    const oldTimerArray = [ ...old.timers.values() ];

    for (let i = 0; i < timerArray.length; i++) {
      if (timerArray[i] != oldTimerArray[i]) {
        return false;
      }
    }

    return true;
  }
}
