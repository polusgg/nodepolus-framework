import { BaseDoorGameRoom } from "./base";
import { SystemType } from "../../../types/systemType";
import { Game } from "..";
import { Player } from "../../player";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { SecurityCameraSystem } from "../../../protocol/entities/baseShipStatus/systems/securityCameraSystem";
import { MedScanSystem } from "../../../protocol/entities/baseShipStatus/systems/medScanSystem";

export enum CamsState {
  Enabled = 1,
  Disabled = 2,
}

export class MedbayGameRoom extends BaseDoorGameRoom {
  get playersScanning(): Player | undefined {
    for (let i = 0; i < this.game.room.players.length; i++) {
      const player = this.game.room.players[i];

      if (player.isScanning) {
        return player;
      }
    }
  }

  get queue(): Player[] {
    const medScanSystem = this.internalShipStatus.systems[InternalSystemType.MedScan] as MedScanSystem;
    const playerIds = [...medScanSystem.playersInQueue.values()];
    const players: Player[] = [];

    for (let i = 0; i < playerIds.length; i++) {
      const player = this.game.room.players.find(p => playerIds[i] == p.playerId);

      if (!player) {
        throw new Error();
        // new err @Cody
      }

      players.push(player);
    }

    return players;
  }

  get camsState(): CamsState {
    return ((this.internalShipStatus.systems[InternalSystemType.SecurityCamera] as SecurityCameraSystem).playersViewingCams.size > 0) ? CamsState.Enabled : CamsState.Disabled;
  }

  constructor(game: Game) {
    super(game, SystemType.Reactor);
  }

  turnOffCams(): void {
    if (this.camsState == CamsState.Enabled) {
      this.internalBackupShipStatus();
      (this.internalShipStatus.systems[InternalSystemType.SecurityCamera] as SecurityCameraSystem).playersViewingCams.clear();
      this.internalUpdateShipStatus();
    }
  }

  turnOnCams(): void {
    this.internalBackupShipStatus();
    (this.internalShipStatus.systems[InternalSystemType.SecurityCamera] as SecurityCameraSystem).playersViewingCams.add(212);
    this.internalUpdateShipStatus();
  }
}
