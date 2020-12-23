import { MessageReader, MessageWriter } from "../../../../util/hazelMessage";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class SecurityCameraSystem extends BaseSystem {
  public playersViewingCameras: Set<number> = new Set();

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
    return new MessageWriter().writeList(this.playersViewingCameras, (writer, player) => {
      writer.writeByte(player);
    });
  }

  setSpawn(data: MessageReader): void {
    this.playersViewingCameras = new Set(data.readList(reader => reader.readByte()));
  }

  equals(old: SecurityCameraSystem): boolean {
    if (this.playersViewingCameras.size != old.playersViewingCameras.size) {
      return false;
    }

    const viewers = [...this.playersViewingCameras];
    const oldViewers = [...old.playersViewingCameras];

    for (let i = 0; i < this.playersViewingCameras.size; i++) {
      if (viewers[i] != oldViewers[i]) {
        return false;
      }
    }

    return true;
  }

  clone(): SecurityCameraSystem {
    const clone = new SecurityCameraSystem();

    clone.playersViewingCameras = new Set(this.playersViewingCameras);

    return clone;
  }
}
