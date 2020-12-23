import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class SabotageSystem extends BaseSystem {
  public cooldown = 0;

  constructor() {
    super(SystemType.Sabotage);
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.cooldown = data.readFloat32();
  }

  getSpawn(): MessageWriter {
    return new MessageWriter().writeFloat32(this.cooldown);
  }

  equals(old: SabotageSystem): boolean {
    if (this.cooldown != old.cooldown) {
      return false;
    }

    return true;
  }

  clone(): SabotageSystem {
    const clone = new SabotageSystem();

    clone.cooldown = this.cooldown;

    return clone;
  }
}
