import { MedScanSystem } from "../../../protocol/entities/baseShipStatus/systems/medScanSystem";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { SystemType } from "../../../types/systemType";
import { BaseDoorGameRoom } from "./base";
import { Player } from "../../player";
import { Game } from "..";

export enum CamsState {
  Enabled = 1,
  Disabled = 2,
}

export class MedbayGameRoom extends BaseDoorGameRoom {
  get internalSystem(): MedScanSystem {
    return this.internalShipStatus.systems[InternalSystemType.MedScan] as MedScanSystem;
  }

  get playersScanning(): Player | undefined {
    for (let i = 0; i < this.game.lobby.players.length; i++) {
      const player = this.game.lobby.players[i];

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
      const player = this.game.lobby.players.find(p => playerIds[i] == p.playerId);

      if (!player) {
        throw new Error("Player in queue for medscan is not on the lobby instance");
      }

      players.push(player);
    }

    return players;
  }

  constructor(game: Game) {
    super(game, SystemType.Medbay);
  }

  // TODO: API methods
}
