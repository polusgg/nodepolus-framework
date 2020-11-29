import { MessageWriter, MessageReader } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class ReactorSystem extends BaseSystem<ReactorSystem> {
  timer!: number;
  userConsoles!: Map<number, number>;

  constructor() {
    super(SystemType.Reactor);
  }

  getData(old: ReactorSystem): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter().writeFloat32(this.timer).writeList(this.userConsoles, (writer, pair) => {
      writer.writeByte(pair[0]);
      writer.writeByte(pair[1]);
    });
  }

  setSpawn(data: MessageReader): void {
    this.timer = data.readFloat32();
    this.userConsoles = new Map(data.readList(reader => [ reader.readByte(), reader.readByte() ]));
  }

  equals(old: ReactorSystem): boolean {
    if (this.timer != old.timer) {
      return false;
    }

    if (this.userConsoles.size != old.userConsoles.size) {
      return false;
    }

    let testVal;

    for (var [key, val] of this.userConsoles) {
      testVal = old.userConsoles.get(key);

      if (testVal !== val || (testVal === undefined && !old.userConsoles.has(key))) {
        return false;
      }
    }

    return true;
  }

  static spawn(data: MessageReader): ReactorSystem {
    let reactorSystem = new ReactorSystem();
    
    reactorSystem.setSpawn(data);
    
    return reactorSystem;
  }
}
