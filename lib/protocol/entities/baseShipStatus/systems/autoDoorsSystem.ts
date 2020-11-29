import { MessageWriter, MessageReader } from "../../../../util/hazelMessage";
import { SKELD_DOOR_COUNT } from "../../../../util/constants";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class AutoDoorsSystem extends BaseSystem<AutoDoorsSystem> {
  doors!: boolean[];

  constructor() {
    super(SystemType.Doors);
  }

  getData(old: AutoDoorsSystem): MessageWriter {
    return new MessageWriter().writeBitfield(this.doors);
  }

  setData(data: MessageReader): void {
    this.doors = data.readBitfield(SKELD_DOOR_COUNT);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter().writeList(this.doors, (writer, door) => {
      writer.writeBoolean(door);
    });
  }

  setSpawn(data: MessageReader): void {
    this.doors = data.readList(reader => reader.readBoolean());
  }

  equals(old: AutoDoorsSystem): boolean {
    if (this.doors.length != old.doors.length) {
      return false;
    }

    for (let i = 0; i < this.doors.length; i++) {
      if (this.doors[i] != old.doors[i]) {
        return false;
      }
    }

    return true;
  }

  static spawn(data: MessageReader): AutoDoorsSystem {
    let autoDoorsSystem = new AutoDoorsSystem();
    
    autoDoorsSystem.setSpawn(data);
    
    return autoDoorsSystem;
  }
}
