import { MedScanSystem } from "../../../protocol/entities/baseShipStatus/systems";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus";
import { SystemType } from "../../../types/enums";
import { PlayerInstance } from "../../player";
import { BaseDoorGameRoom } from ".";
import { Game } from "..";

export class MedbayGameRoom extends BaseDoorGameRoom {
  constructor(game: Game) {
    super(game, SystemType.Medbay);
  }

  getInternalSystem(): MedScanSystem {
    return this.getInternalShipStatus().systems[InternalSystemType.MedScan] as MedScanSystem;
  }

  getPlayersScanning(): PlayerInstance | undefined {
    for (let i = 0; i < this.game.lobby.getPlayers().length; i++) {
      const player = this.game.lobby.getPlayers()[i];

      if (player.isScanning()) {
        return player;
      }
    }
  }

  getQueue(): PlayerInstance[] {
    const playerIds = [...this.getInternalSystem().playersInQueue.values()];
    const players: PlayerInstance[] = [];

    for (let i = 0; i < playerIds.length; i++) {
      const player = this.game.lobby.findPlayerByPlayerId(playerIds[i]);

      if (!player) {
        throw new Error("Player in queue for medscan is not on the lobby instance");
      }

      players.push(player);
    }

    return players;
  }

  // TODO: API methods
}
