import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class SecurityCameraSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    // TODO: Make protected with getter/setter
    public playersViewingCameras: Set<number> = new Set(),
  ) {
    super(shipStatus, SystemType.Security);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeList(this.playersViewingCameras, (writer, player) => {
      writer.writeByte(player);
    });
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
    return new SecurityCameraSystem(this.shipStatus, new Set(this.playersViewingCameras));
  }
}
