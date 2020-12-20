import { MedScanSystem } from "../../../protocol/entities/baseShipStatus/systems";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus";
import { SystemType } from "../../../types/enums";
import { Player } from "../../player";
import { BaseDoorGameRoom } from ".";
import { Game } from "..";

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
