import { DoorsSystem, SYSTEM_DOORS } from "../../../protocol/entities/baseShipStatus/systems/doorsSystem";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus/systems/type";
import { GameDataPacket } from "../../../protocol/packets/rootGamePackets/gameData";
import { InnerLevel } from "../../../protocol/entities/types";
import { Connection } from "../../../protocol/connection";
import { SystemType } from "../../../types/systemType";
import { Level } from "../../../types/level";
import { CustomHost } from "../../../host";
import { GameEvents, Game } from "..";
import { Player } from "../../player";
import { DOOR_DATA } from "../data";
import Emittery from "emittery";
import { Door } from "../door";

export class BaseGameRoom extends Emittery.Typed<GameEvents> {
  private shipStatusBackup?: InnerLevel;

  get players(): Player[] {
    // TODO
    return [];
  }

  get internalShipStatus(): InnerLevel {
    if (!this.game.room.internalRoom.shipStatus) {
      throw new Error("Attempted get ShipStatus without an instance on the room");
    }

    return this.game.room.internalRoom.shipStatus.innerNetObjects[0];
  }

  constructor(public game: Game, public systemType: SystemType) {
    super();
  }

  internalBackupShipStatus(): void {
    if (!this.game.room.internalRoom.shipStatus) {
      throw new Error("Attempted to make a copy of ShipStatus without an instance on the room");
    }

    this.shipStatusBackup = this.game.room.internalRoom.shipStatus.innerNetObjects[0].clone();
  }

  internalUpdateShipStatus(): void {
    if (!this.game.room.internalRoom.shipStatus) {
      throw new Error("Attempted to update ShipStatus without an instance on the room");
    }

    if (!this.shipStatusBackup) {
      this.internalBackupShipStatus();
    }

    //@ts-ignore Talk to cody about this.
    const data = this.game.room.internalRoom.shipStatus.innerNetObjects[0].getData(this.shipSatusBackup);

    this.game.room.internalRoom.sendRootGamePacket(new GameDataPacket([data], this.game.room.code));
  }
}

export class BaseDoorGameRoom extends BaseGameRoom {
  public doors: Door[];

  constructor(game: Game, systemType: SystemType) {
    super(game, systemType);

    this.doors = DOOR_DATA[this.game.room.settings.level == Level.AprilSkeld
      ? Level.TheSkeld
      : this.game.room.settings.level
    ][this.systemType].map((id: number) => new Door(game, id));
  }

  closeDoors(): void {
    const host = this.game.room.internalRoom.host;

    if (host instanceof CustomHost) {
      if (!host.doorHandler) {
        throw new Error("Attempted to close doors without a DoorHandler instance");
      }

      host.doorHandler.closeDoor(host.doorHandler.getDoorsForSystem(this.systemType));
    } else if (host instanceof Connection) {
      this.internalBackupShipStatus();
      this.internalShipStatus.closeDoorsOfType(this.systemType);
      this.internalUpdateShipStatus();
    } else {
      throw new Error("Attempted to close doors with an unsupported host instance");
    }
  }

  openDoors(): void {
    if (this.game.room.settings.level == Level.TheSkeld) {
      throw new Error("Cannot open doors on The Skeld due to client limitations");
    } else {
      this.internalBackupShipStatus();

      const doors = SYSTEM_DOORS.get(this.systemType);

      if (!doors) {
        throw new Error(`SystemType ${this.systemType} (${SystemType[this.systemType]}) does not have any doors`);
      }

      for (let i = 0; i < doors.length; i++) {
        (this.internalShipStatus.systems[InternalSystemType.Doors] as DoorsSystem).doorStates[doors[i]] = true;
      }
    }
  }
}
