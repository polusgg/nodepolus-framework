import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class LifeSuppSystem extends BaseSystem<LifeSuppSystem> {
  public timer!: number;
  public completedConsoles!: Set<number>;

  constructor() {
    super(SystemType.Oxygen);
  }

  static spawn(data: MessageReader): LifeSuppSystem {
    const lifeSuppSystem = new LifeSuppSystem();

    lifeSuppSystem.setSpawn(data);

    return lifeSuppSystem;
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter().writeFloat32(this.timer)
      .writeList(this.completedConsoles, (writer, con) => {
        writer.writePackedUInt32(con);
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

    const completedConsolesArray = new Array(this.completedConsoles);
    const oldCompletedConsolesArray = new Array(old.completedConsoles);

    for (let i = 0; i < completedConsolesArray.length; i++) {
      if (completedConsolesArray[i] != oldCompletedConsolesArray[i]) {
        return false;
      }
    }

    return true;
  }
}
