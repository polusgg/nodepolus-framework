import { MessageWriter, MessageReader } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export enum DecontaminationDoorState {
  Idle = 0,
  Enter = 1 << 0,
  Closed = 1 << 1,
  Exit = 1 << 2,
  HeadingUp = 1 << 3,
}

export class DeconSystem extends BaseSystem<DeconSystem> {
  timer!: number;
  state!: DecontaminationDoorState;

  constructor() {
    super(SystemType.Reactor);
  }

  getData(old: DeconSystem): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter().writeByte(this.timer).writeByte(this.state);
  }

  setSpawn(data: MessageReader): void {
    this.timer = data.readByte();
    this.state = data.readByte();
  }

  equals(old: DeconSystem): boolean {
    if (this.timer != old.timer) {
      return false;
    }

    if (this.state != old.state) {
      return false;
    }

    return true;
  }

  static spawn(data: MessageReader): DeconSystem {
    let deconSystem = new DeconSystem();
    
    deconSystem.setSpawn(data);
    
    return deconSystem;
  }
}
