import { MessageWriter, MessageReader } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class LifeSuppSystem extends BaseSystem<LifeSuppSystem> {
  timer!: number;
  completedConsoles!: Set<number>;

  constructor() {
    super(SystemType.Oxygen);
  }

  getData(old: LifeSuppSystem): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter().writeFloat32(this.timer).writeList(this.completedConsoles, (writer, console) => {
      writer.writePackedUInt32(console);
    });
  }

  setSpawn(data: MessageReader): void {
    this.timer = data.readFloat32();
    this.completedConsoles = new Set(data.readList(reader => reader.readPackedUInt32()));
  }

  equals(old: LifeSuppSystem): boolean {
    if (this.timer != old.timer) {
      return false;
    }

    if (this.completedConsoles.size != old.completedConsoles.size) {
      return false;
    }

    let completedConsolesArray = new Array(this.completedConsoles);
    let oldCompletedConsolesArray = new Array(old.completedConsoles);

    for (let i = 0; i < completedConsolesArray.length; i++) {
      if (completedConsolesArray[i] != oldCompletedConsolesArray[i]) {
        return false;
      }
    }

    return true;
  }

  static spawn(data: MessageReader): LifeSuppSystem {
    let lifeSuppSystem = new LifeSuppSystem();
    
    lifeSuppSystem.setSpawn(data);
    
    return lifeSuppSystem;
  }
}
