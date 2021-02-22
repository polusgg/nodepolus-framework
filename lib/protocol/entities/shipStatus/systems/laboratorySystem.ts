import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class LaboratorySystem extends BaseSystem {
  // TODO: Make protected with getter/setter
  public timer = 10000;
  // TODO: Make protected with getter/setter
  public userConsoles: Map<number, number> = new Map();

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.Laboratory);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter()
      .writeFloat32(this.timer)
      .writeList(this.userConsoles, (writer, pair) => {
        writer.writeByte(pair[0]);
        writer.writeByte(pair[1]);
      });
  }

  equals(old: LaboratorySystem): boolean {
    if (this.timer != old.timer) {
      return false;
    }

    if (this.userConsoles.size != old.userConsoles.size) {
      return false;
    }

    let testVal;

    for (const [key, val] of this.userConsoles) {
      testVal = old.userConsoles.get(key);

      if (testVal !== val) {
        return false;
      }

      if (!testVal && !old.userConsoles.has(key)) {
        return false;
      }
    }

    return true;
  }

  clone(): LaboratorySystem {
    const clone = new LaboratorySystem(this.shipStatus);

    clone.timer = this.timer;
    clone.userConsoles = new Map(this.userConsoles);

    return clone;
  }
}
