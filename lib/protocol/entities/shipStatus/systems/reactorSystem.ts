import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class ReactorSystem extends BaseSystem {
  public timer = 10000;
  public userConsoles: Map<number, number> = new Map();

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.Reactor);
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.timer = data.readFloat32();
    this.userConsoles = new Map(data.readList(reader => [reader.readByte(), reader.readByte()]));
  }

  getSpawn(): MessageWriter {
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
    const clone = new ReactorSystem(this.shipStatus);

    clone.timer = this.timer;
    clone.userConsoles = new Map(this.userConsoles);

    return clone;
  }
}
