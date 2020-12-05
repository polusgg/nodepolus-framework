import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/systemType";
import { BaseSystem } from "./baseSystem";

export class SecurityCameraSystem extends BaseSystem<SecurityCameraSystem> {
  public playersViewingCams: Set<number> = new Set();

  constructor() {
    super(SystemType.Security);
  }

  static spawn(data: MessageReader): SecurityCameraSystem {
    const securityCameraSystem = new SecurityCameraSystem();

    securityCameraSystem.setSpawn(data);

    return securityCameraSystem;
  }

  getData(): MessageWriter {
    return this.getSpawn();
  }

  setData(data: MessageReader): void {
    this.setSpawn(data);
  }

  getSpawn(): MessageWriter {
    return new MessageWriter().writeList(this.playersViewingCams, (writer, player) => {
      writer.writeByte(player);
    });
  }

  setSpawn(data: MessageReader): void {
    this.playersViewingCams = new Set(data.readList(reader => reader.readByte()));
  }

  equals(old: SecurityCameraSystem): boolean {
    if (this.playersViewingCams.size != old.playersViewingCams.size) {
      return false;
    }

    const viewers = [...this.playersViewingCams];
    const oldViewers = [...old.playersViewingCams];

    for (let i = 0; i < this.playersViewingCams.size; i++) {
      if (viewers[i] != oldViewers[i]) {
        return false;
      }
    }

    return true;
  }
}
