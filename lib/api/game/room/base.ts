import { DoorsSystem, SYSTEM_DOORS } from "../../../protocol/entities/baseShipStatus/systems/doorsSystem";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { GameDataPacket } from "../../../protocol/packets/root/gameData";
import { InnerLevel } from "../../../protocol/entities/types";
import { Level, SystemType } from "../../../types/enums";
import { GameEvents, Game } from "..";
import { Player } from "../../player";
import { DOOR_DATA } from "../data";
import Emittery from "emittery";
import { Door } from "../door";

export class BaseGameRoom extends Emittery.Typed<GameEvents> {
  private shipStatusBackup?: InnerLevel;

  constructor(public game: Game, public systemType: SystemType) {
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

export class BaseDoorGameRoom extends BaseGameRoom {
  public doors: Door[];

  constructor(game: Game, systemType: SystemType) {
    super(game, systemType);

    this.doors = DOOR_DATA[this.game.lobby.settings.level == Level.AprilSkeld
      ? Level.TheSkeld
      : this.game.lobby.settings.level
    ][this.systemType].map((id: number) => new Door(game, id));
  }

  closeDoors(): void {
    const host = this.game.lobby.internalLobby.customHostInstance;

    if (!host.doorHandler) {
      throw new Error("Attempted to close doors without a DoorHandler instance");
    }

    host.doorHandler.closeDoor(host.doorHandler.getDoorsForSystem(this.systemType));
  }

  openDoors(): void {
    if (this.game.lobby.settings.level == Level.TheSkeld) {
      throw new Error("Cannot open doors on The Skeld due to client limitations");
    } else {
      this.internalBackupShipStatus();

      const doors = SYSTEM_DOORS.get(this.systemType);

      if (!doors) {
        throw new Error(`SystemType ${this.systemType} (${SystemType[this.systemType]}) does not have any doors`);
      }

      for (let i = 0; i < doors.length; i++) {
        (this.getInternalShipStatus().systems[InternalSystemType.Doors] as DoorsSystem).doorStates[doors[i]] = true;
      }
    }
  }
}
