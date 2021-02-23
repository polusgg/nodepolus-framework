import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../../types/enums";
import { BaseSystem } from ".";

export class SecurityCameraSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected playersViewingCameras: Set<number> = new Set(),
  ) {
    super(shipStatus, SystemType.Security);
  }

  getPlayersViewingCameras(): Set<number> {
    return this.playersViewingCameras;
  }

  setPlayersViewingCameras(playersViewingCameras: Set<number>): this {
    this.playersViewingCameras = playersViewingCameras;

    return this;
  }

  clearPlayersViewingCameras(): this {
    this.playersViewingCameras.clear();

    return this;
  }

  addPlayerViewingCameras(playerId: number): this {
    this.playersViewingCameras.add(playerId);

    return this;
  }

  removePlayerViewingCameras(playerId: number): this {
    this.playersViewingCameras.delete(playerId);

    return this;
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
