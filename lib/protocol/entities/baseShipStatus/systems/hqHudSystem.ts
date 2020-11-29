import { MessageWriter, MessageReader } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class HqHudSystem extends BaseSystem<HqHudSystem> {
  activeConsoles!: Map<number, number>;
  completedConsoles!: Set<number>;

  constructor() {
    super(SystemType.Communications);
  }

  getData(old: HqHudSystem): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter().writeList(this.activeConsoles, (writer, pair) => {
      writer.writeByte(pair[0]);
      writer.writeByte(pair[1]);
    }).writeList(this.completedConsoles, (writer, console) => {
      writer.writeByte(console);
    });
  }

  setSpawn(data: MessageReader): void {
    this.activeConsoles = new Map(data.readList(reader => {
      return [
        reader.readByte(),
        reader.readByte(),
      ];
    }));
    this.completedConsoles = new Set(data.readList(reader => {
      return reader.readByte();
    }));
  }

  equals(old: HqHudSystem): boolean {
    if (this.activeConsoles.size != old.activeConsoles.size) {
      return false;
    }

    if (this.completedConsoles.size != old.completedConsoles.size) {
      return false;
    }

    let completedConsolesArray = Array.from(this.completedConsoles);
    let oldCompletedConsolesArray = Array.from(old.completedConsoles);

    for (let i = 0; i < completedConsolesArray.length; i++) {
      if (oldCompletedConsolesArray[i] != completedConsolesArray[i]) {
        return false;
      }
    }

    if (this.activeConsoles.size != old.activeConsoles.size) {
      return false;
    }

    let testVal;

    for (var [key, val] of this.activeConsoles) {
      testVal = old.activeConsoles.get(key);

      if (testVal !== val || (testVal === undefined && !old.activeConsoles.has(key))) {
        return false;
      }
    }

    return true;
  }

  static spawn(data: MessageReader): HqHudSystem {
    let hqHudSystem = new HqHudSystem();
    
    hqHudSystem.setSpawn(data);
    
    return hqHudSystem;
  }
}
