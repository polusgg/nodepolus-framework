import { MessageWriter, MessageReader } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class SabotageSystem extends BaseSystem<SabotageSystem> {
  cooldown!: number;

  constructor() {
    super(SystemType.Sabotage);
  }

  getData(old: SabotageSystem): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter().writeFloat32(this.cooldown);
  }

  setSpawn(data: MessageReader): void {
    this.cooldown = data.readFloat32();
  }

  equals(old: SabotageSystem): boolean {
    if (this.cooldown != old.cooldown) {
      return false;
    }

    return true;
  }

  static spawn(data: MessageReader): SabotageSystem {
    let sabotageSystem = new SabotageSystem();
    
    sabotageSystem.setSpawn(data);
    
    return sabotageSystem;
  }
}
