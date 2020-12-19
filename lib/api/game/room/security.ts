import { SecurityCameraSystem } from "../../../protocol/entities/baseShipStatus/systems/securityCameraSystem";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { SystemType } from "../../../types/systemType";
import { BaseDoorGameRoom } from "./base";
import { Player } from "../../player";
import { Game } from "..";

export enum CameraState {
  Active = 1,
  Inactive = 2,
}

export class SecurityGameRoom extends BaseDoorGameRoom {
  get internalSystem(): SecurityCameraSystem {
    return this.internalShipStatus.systems[InternalSystemType.SecurityCamera] as SecurityCameraSystem;
  }

  get playersViewingCameras(): Player[] {
    const players: Player[] = [];
    const playersIds = [...this.internalSystem.playersViewingCams.values()];

    for (let i = 0; i < playersIds.length; i++) {
      const player = this.game.lobby.players.find(p => p.playerId == playersIds[i]);

      // 212 is a magic number used to identify a fake player for when the
      // cameras are active without any players viewing them.
      if (!player && playersIds[i] != 212) {
        throw new Error(`Unknown player viewing security cameras ${playersIds[i]}`);
      }

      if (player) {
        players.push(player);
      }
    }

    return players;
  }

  get cameraState(): CameraState {
    return (this.internalSystem.playersViewingCams.size > 0) ? CameraState.Active : CameraState.Inactive;
  }

  constructor(game: Game) {
    super(game, SystemType.Security);
  }

  activateCameras(): void {
    if (this.cameraState == CameraState.Active) {
      this.internalBackupShipStatus();
      this.internalSystem.playersViewingCams.clear();
      this.internalUpdateShipStatus();
    }
  }

  deactivateCameras(): void {
    this.internalBackupShipStatus();
    this.internalSystem.playersViewingCams.add(212);
    this.internalUpdateShipStatus();
  }
}
