import { DoorsSystem } from "../../../protocol/entities/baseShipStatus/systems";
import { InternalSystemType } from "../../../protocol/entities/baseShipStatus";
import { Level, SystemType } from "../../../types/enums";
import { SystemDoors } from "../../../static/doors";
import { BaseGameRoom } from ".";
import { Door, Game } from "..";

export class BaseDoorGameRoom extends BaseGameRoom {
  public doors: Door[];

  constructor(game: Game, systemType: SystemType) {
    super(game, systemType);

    this.doors = SystemDoors.forSkeld()[this.systemType]?.map((id: number) => new Door(game, id)) ?? [];
  }

  closeDoors(): void {
    const host = this.game.lobby.getHostInstance();
    const doorHandler = host.getDoorHandler();

    if (!doorHandler) {
      throw new Error("Attempted to close doors without a DoorHandler instance");
    }

    doorHandler.closeDoor(doorHandler.getDoorsForSystem(this.systemType));
  }

  openDoors(): void {
    const level = this.game.lobby.getOptions().getLevels()[0];

    if (level == Level.TheSkeld) {
      throw new Error("Cannot open doors on The Skeld due to client limitations");
    } else {
      this.internalBackupShipStatus();

      const doors = SystemDoors.forLevel(level)[this.systemType];

      if (!doors) {
        throw new Error(`SystemType ${this.systemType} (${SystemType[this.systemType]}) does not have any doors`);
      }

      for (let i = 0; i < doors.length; i++) {
        (this.getInternalShipStatus().systems[InternalSystemType.Doors] as DoorsSystem).doorStates[doors[i]] = true;
      }
    }
  }
}
