import { MedScanSystem } from "../../../protocol/entities/baseShipStatus/systems/medScanSystem";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { SystemType } from "../../../types/enums";
import { BaseDoorGameRoom } from "./base";
import { Player } from "../../player";
import { Game } from "..";

export enum CamsState {
  Enabled = 1,
  Disabled = 2,
}

export class MedbayGameRoom extends BaseDoorGameRoom {
  constructor(game: Game) {
    super(game, SystemType.Medbay);
  }

  getInternalSystem(): MedScanSystem {
    return this.getInternalShipStatus().systems[InternalSystemType.MedScan] as MedScanSystem;
  }

  getPlayersScanning(): Player | undefined {
    for (let i = 0; i < this.game.lobby.players.length; i++) {
      const player = this.game.lobby.players[i];

      if (player.isScanning) {
        return player;
      }
    }
  }

  getQueue(): Player[] {
    const playerIds = [...this.getInternalSystem().playersInQueue.values()];
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

  // TODO: API methods
}
