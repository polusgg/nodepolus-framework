import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class LifeSuppSystem extends BaseSystem<LifeSuppSystem> {
  public timer = 10000;
  public completedConsoles: Set<number> = new Set([0, 1]);

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
    return new MessageWriter()
      .writeFloat32(this.timer)
      .writeList(this.completedConsoles, (writer, con) => writer.writePackedUInt32(con));
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

    const completedConsolesArray = [...this.completedConsoles];
    const oldCompletedConsolesArray = [...old.completedConsoles];

    for (let i = 0; i < completedConsolesArray.length; i++) {
      if (completedConsolesArray[i] != oldCompletedConsolesArray[i]) {
        return false;
      }
    }

    return true;
  }

  clone(): LifeSuppSystem {
    const clone = new LifeSuppSystem();

    clone.timer = this.timer;
    clone.completedConsoles = new Set(this.completedConsoles);

    return clone;
  }
}
