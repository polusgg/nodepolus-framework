import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class HudOverrideSystem extends BaseSystem {
  public sabotaged = false;

  constructor() {
    super(SystemType.Communications);
  }

  static spawn(data: MessageReader): HudOverrideSystem {
    const hudOverrideSystem = new HudOverrideSystem();

    hudOverrideSystem.setSpawn(data);

    return hudOverrideSystem;
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter().writeBoolean(this.sabotaged);
  }

  setSpawn(data: MessageReader): void {
    this.sabotaged = data.readBoolean();
  }

  equals(old: HudOverrideSystem): boolean {
    return this.sabotaged == old.sabotaged;
  }

  clone(): HudOverrideSystem {
    const clone = new HudOverrideSystem();

    clone.sabotaged = this.sabotaged;

    return clone;
  }
}
