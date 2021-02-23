import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class HqHudSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    // TODO: Make protected with getter/setter
    public activeConsoles: Map<number, number> = new Map(),
    // TODO: Make protected with getter/setter
    public completedConsoles: Set<number> = new Set([0, 1]),
  ) {
    super(shipStatus, SystemType.Communications);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeList(this.activeConsoles, (writer, pair) => {
      writer.writeByte(pair[0]);
      writer.writeByte(pair[1]);
    }).writeList(this.completedConsoles, (writer, con) => writer.writeByte(con));
  }

  equals(old: HqHudSystem): boolean {
    if (this.activeConsoles.size != old.activeConsoles.size) {
      return false;
    }

    if (this.completedConsoles.size != old.completedConsoles.size) {
      return false;
    }

    const completedConsolesArray = [...this.completedConsoles];
    const oldCompletedConsolesArray = [...old.completedConsoles];

    for (let i = 0; i < completedConsolesArray.length; i++) {
      if (oldCompletedConsolesArray[i] != completedConsolesArray[i]) {
        return false;
      }
    }

    if (this.activeConsoles.size != old.activeConsoles.size) {
      return false;
    }

    let testVal: number | undefined;

    for (const [key, val] of this.activeConsoles) {
      testVal = old.activeConsoles.get(key);

      if (testVal !== val) {
        return false;
      }

      if (!testVal && !old.activeConsoles.has(key)) {
        return false;
      }
    }

    return true;
  }

  clone(): HqHudSystem {
    return new HqHudSystem(this.shipStatus, new Map(this.activeConsoles), new Set(this.completedConsoles));
  }
}
