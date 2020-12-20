import { GameDataPacket } from "../../../protocol/packets/root";
import { InnerLevel } from "../../../protocol/entities/types";
import { SystemType } from "../../../types/enums";
import { Game, GameEvents } from "..";
import { Player } from "../../player";
import Emittery from "emittery";

export class BaseGameRoom extends Emittery.Typed<GameEvents> {
  private shipStatusBackup?: InnerLevel;

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

  getInternalShipStatus(): InnerLevel {
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

    //@ts-ignore Talk to cody about this.
    const data = this.game.lobby.internalLobby.shipStatus.innerNetObjects[0].getData(this.shipSatusBackup);

    this.game.lobby.internalLobby.sendRootGamePacket(new GameDataPacket([data], this.game.lobby.code));
  }
}
