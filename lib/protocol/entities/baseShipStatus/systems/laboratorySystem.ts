import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "..";
import { BaseSystem } from ".";

export class LaboratorySystem extends BaseSystem {
  public timer = 10000;
  public userConsoles: Map<number, number> = new Map();

  constructor(shipStatus: BaseInnerShipStatus) {
    super(shipStatus, SystemType.Laboratory);
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
