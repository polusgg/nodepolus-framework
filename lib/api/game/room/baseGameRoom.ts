import { BaseInnerShipStatus } from "../../../protocol/entities/baseShipStatus";
import { GameDataPacket } from "../../../protocol/packets/root";
import { SystemType } from "../../../types/enums";
import { InternalLobby } from "../../../lobby";
import { PlayerInstance } from "../../player";
import { Game, GameEvents } from "..";
import Emittery from "emittery";

export class BaseGameRoom extends Emittery.Typed<GameEvents> {
  private shipStatusBackup?: BaseInnerShipStatus;

  constructor(
    public game: Game,
    public systemType: SystemType,
  ) {
    super();
  }

  getPlayers(): PlayerInstance[] {
    // TODO
    return [];
  }

  getInternalShipStatus(): BaseInnerShipStatus {
    const shipStatus = this.game.lobby.getShipStatus();

    if (!shipStatus) {
      throw new Error("Attempted to get ShipStatus without an instance on the lobby");
    }

    return shipStatus.getShipStatus();
  }

  internalBackupShipStatus(): void {
    const shipStatus = this.game.lobby.getShipStatus();

    if (!shipStatus) {
      throw new Error("Attempted to make a copy of ShipStatus without an instance on the lobby");
    }

    this.shipStatusBackup = shipStatus.getShipStatus().clone();
  }

  internalUpdateShipStatus(): void {
    const shipStatus = this.game.lobby.getShipStatus();

    if (!shipStatus) {
      throw new Error("Attempted to update ShipStatus without an instance on the lobby");
    }

    if (!this.shipStatusBackup) {
      this.internalBackupShipStatus();
    }

    if (!this.shipStatusBackup) {
      throw new Error("Attempted to update ShipStatus but failed to first make a backup");
    }

    const data = shipStatus.getShipStatus().getData(this.shipStatusBackup);

    // TODO: Don't cast to an internal class from within the API folder
    (this.game.lobby as InternalLobby).sendRootGamePacket(new GameDataPacket([data], this.game.lobby.getCode()));
  }
}
