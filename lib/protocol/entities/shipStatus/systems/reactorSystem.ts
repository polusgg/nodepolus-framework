import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class ReactorSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    // TODO: Make protected with getter/setter
    public timer: number = 10000,
    // TODO: Make protected with getter/setter
    public userConsoles: Map<number, number> = new Map(),
  ) {
    super(shipStatus, SystemType.Reactor);
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

  equals(old: ReactorSystem): boolean {
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

  clone(): ReactorSystem {
    return new ReactorSystem(this.shipStatus, this.timer, new Map(this.userConsoles));
  }
}
