import { SecurityCameraSystem } from "../../../protocol/entities/baseShipStatus/systems";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus";
import { SystemType } from "../../../types/enums";
import { Player } from "../../player";
import { BaseDoorGameRoom } from ".";
import { Game } from "..";

export enum CameraState {
  Active = 1,
  Inactive = 2,
}

export class SecurityGameRoom extends BaseDoorGameRoom {
  constructor(game: Game) {
    super(game, SystemType.Security);
  }

  getInternalSystem(): SecurityCameraSystem {
    return this.getInternalShipStatus().systems[InternalSystemType.SecurityCamera] as SecurityCameraSystem;
  }

  getPlayersViewingCameras(): Player[] {
    const players: Player[] = [];
    const playerIds = [...this.getInternalSystem().playersViewingCameras.values()];

    for (let i = 0; i < playerIds.length; i++) {
      const player = this.game.lobby.players.find(p => p.playerId == playerIds[i]);

      // 212 is a magic number used to identify a fake player for when the
      // cameras are active without any players viewing them.
      if (!player && playerIds[i] != 212) {
        throw new Error(`Unknown player viewing security cameras ${playerIds[i]}`);
      }

      if (player) {
        players.push(player);
      }
    }

    return players;
  }

  getCameraState(): CameraState {
    return (this.getInternalSystem().playersViewingCameras.size > 0) ? CameraState.Active : CameraState.Inactive;
  }

  activateCameras(): void {
    if (this.getCameraState() == CameraState.Active) {
      this.internalBackupShipStatus();
      this.getInternalSystem().playersViewingCameras.clear();
      this.internalUpdateShipStatus();
    }
  }

  deactivateCameras(): void {
    this.internalBackupShipStatus();
    this.getInternalSystem().playersViewingCameras.add(212);
    this.internalUpdateShipStatus();
  }
}
