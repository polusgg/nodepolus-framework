import { BaseInnerShipStatus } from "../../../protocol/entities/baseShipStatus";
import { GameDataPacket } from "../../../protocol/packets/root";
import { SystemType } from "../../../types/enums";
import { Game, GameEvents } from "..";
import { Player } from "../../player";
import Emittery from "emittery";

export class BaseGameRoom extends Emittery.Typed<GameEvents> {
  private shipStatusBackup?: BaseInnerShipStatus;

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

  getInternalShipStatus(): BaseInnerShipStatus {
    if (!this.game.lobby.internalLobby.shipStatus) {
      throw new Error("Attempted to get ShipStatus without an instance on the lobby");
    }

    return this.game.lobby.internalLobby.shipStatus.getShipStatus();
  }

  internalBackupShipStatus(): void {
    if (!this.game.lobby.internalLobby.shipStatus) {
      throw new Error("Attempted to make a copy of ShipStatus without an instance on the lobby");
    }

    this.shipStatusBackup = this.game.lobby.internalLobby.shipStatus.getShipStatus().clone();
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

    const data = this.game.lobby.internalLobby.shipStatus.getShipStatus().getData(this.shipStatusBackup);

    this.game.lobby.internalLobby.sendRootGamePacket(new GameDataPacket([data], this.game.lobby.code));
  }
}
