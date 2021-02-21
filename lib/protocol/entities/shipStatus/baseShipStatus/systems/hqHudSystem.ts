import { MessageReader, MessageWriter } from "../../../../../util/hazelMessage";
import { SystemType } from "../../../../../types/enums";
import { BaseInnerShipStatus } from "..";
import { BaseSystem } from ".";

export class HqHudSystem extends BaseSystem {
  public activeConsoles: Map<number, number> = new Map();
  public completedConsoles: Set<number> = new Set([0, 1]);

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.Communications);
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.activeConsoles = new Map(data.readList(reader => [
      reader.readByte(),
      reader.readByte(),
    ]));
    this.completedConsoles = new Set(data.readList(reader => reader.readByte()));
  }

  getSpawn(): MessageWriter {
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
    const clone = new HqHudSystem(this.shipStatus);

    clone.activeConsoles = new Map(this.activeConsoles);
    clone.completedConsoles = new Set(this.completedConsoles);

    return clone;
  }
}
