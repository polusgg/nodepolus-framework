import { BaseShipStatus } from "../../../protocol/entities/baseShipStatus";
import { GameDataPacket } from "../../../protocol/packets/root";
import { SystemType } from "../../../types/enums";
import { Game, GameEvents } from "..";
import { Player } from "../../player";
import Emittery from "emittery";

export class BaseGameRoom extends Emittery.Typed<GameEvents> {
  private shipStatusBackup?: BaseShipStatus;

  constructor(
    public game: Game,
    public systemType: SystemType,
  ) {
    super();
  }

  getPlayers(): Player[] {
    // TODO
    return [];
  }

  getInternalShipStatus(): BaseShipStatus {
    if (!this.game.lobby.internalLobby.shipStatus) {
      throw new Error("Attempted to get ShipStatus without an instance on the lobby");
    }

    return this.game.lobby.internalLobby.shipStatus.innerNetObjects[0];
  }

  internalBackupShipStatus(): void {
    if (!this.game.lobby.internalLobby.shipStatus) {
      throw new Error("Attempted to make a copy of ShipStatus without an instance on the lobby");
    }

    this.shipStatusBackup = this.game.lobby.internalLobby.shipStatus.innerNetObjects[0].clone();
  }

  internalUpdateShipStatus(): void {
    if (!this.game.lobby.internalLobby.shipStatus) {
      throw new Error("Attempted to update ShipStatus without an instance on the lobby");
    }

    if (!this.shipStatusBackup) {
      this.internalBackupShipStatus();
    }

    if (!this.shipStatusBackup) {
      throw new Error("Attempted to update ShipStatus but failed to first make a backup");
    }

    const data = this.game.lobby.internalLobby.shipStatus.innerNetObjects[0].getData(this.shipStatusBackup);

    this.game.lobby.internalLobby.sendRootGamePacket(new GameDataPacket([data], this.game.lobby.code));
  }
}
