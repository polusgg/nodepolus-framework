import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class ReactorSystem extends BaseSystem<ReactorSystem> {
  public timer = 10000;
  public userConsoles: Map<number, number> = new Map();

  constructor() {
    super(SystemType.Reactor);
  }

  static spawn(data: MessageReader): ReactorSystem {
    const reactorSystem = new ReactorSystem();

    reactorSystem.setSpawn(data);

    return reactorSystem;
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter()
      .writeFloat32(this.timer)
      .writeList(this.userConsoles, (writer, pair) => {
        writer.writeByte(pair[0]);
        writer.writeByte(pair[1]);
      });
  }

  setSpawn(data: MessageReader): void {
    console.table({ data });

    this.timer = data.readFloat32();
    this.userConsoles = new Map(data.readList(reader => [reader.readByte(), reader.readByte()]));
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
    const clone = new ReactorSystem();

    clone.timer = this.timer;
    clone.userConsoles = new Map(this.userConsoles);

    return clone;
  }
}
