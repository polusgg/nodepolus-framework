import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class LifeSuppSystem extends BaseSystem {
  // TODO: Make protected with getter/setter
  public timer = 10000;
  // TODO: Make protected with getter/setter
  public completedConsoles: Set<number> = new Set([0, 1]);

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.Oxygen);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
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
