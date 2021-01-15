import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";
import { BaseInnerShipStatus } from "..";

export class LifeSuppSystem extends BaseSystem {
  public timer = 10000;
  public completedConsoles: Set<number> = new Set([0, 1]);

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.Oxygen);
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.timer = data.readFloat32();
    this.completedConsoles = new Set(data.readList(reader => reader.readPackedUInt32()));
  }

  getSpawn(): MessageWriter {
    return new MessageWriter()
      .writeFloat32(this.timer)
      .writeList(this.completedConsoles, (writer, con) => writer.writePackedUInt32(con));
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
    const clone = new LifeSuppSystem(this.shipStatus);

    clone.timer = this.timer;
    clone.completedConsoles = new Set(this.completedConsoles);

    return clone;
  }
}
