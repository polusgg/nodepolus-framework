import { DoorsSystem } from "../../protocol/entities/baseShipStatus/systems";
import { GameDataPacket } from "../../protocol/packets/root";
import { InnerLevel } from "../../protocol/entities/types";
import { SystemDoors } from "../../static/doors";
import { SystemType } from "../../types/enums";
import { CustomHost } from "..";

export class DoorsHandler {
  private readonly systemTimers: NodeJS.Timeout[] = [];

  private oldShipStatus: InnerLevel;

  constructor(public host: CustomHost, public shipStatus: InnerLevel) {
    this.oldShipStatus = shipStatus.clone();
  }

  closeDoor(doorIds: number | number[]): void {
    this.setOldShipStatus();

    const doorsSystem = this.shipStatus.getSystemFromType(SystemType.Doors) as DoorsSystem;

    if (doorIds instanceof Array) {
      for (let i = 0; i < doorIds.length; i++) {
        const id = doorIds[i];

        doorsSystem.doorStates[id] = false;
      }
    } else {
      doorsSystem.doorStates[doorIds] = false;
    }

    this.sendDataUpdate();
  }

  getDoorsForSystem(systemId: SystemType): number[] {
    const doors = SystemDoors.forLevel(this.host.lobby.options.levels[0])[systemId];

    if (!doors) {
      throw new Error(`SystemType ${systemId} (${SystemType[systemId]}) does not have any doors`);
    }

    return doors;
  }

  setSystemTimeout(systemId: SystemType, time: number): void {
    this.setOldShipStatus();

    const doorsSystem = this.shipStatus.getSystemFromType(SystemType.Doors) as DoorsSystem;

    doorsSystem.timers.set(systemId, time);

    this.systemTimers[systemId] = setInterval(() => {
      let currentTime = doorsSystem.timers.get(systemId);

      if (currentTime && currentTime != 0) {
        doorsSystem.timers.set(systemId, --currentTime);
      } else {
        clearInterval(this.systemTimers[systemId]);
      }
    }, 1000);

    this.sendDataUpdate();
  }

  setOldShipStatus(): void {
    this.oldShipStatus = this.shipStatus.clone();
  }

  sendDataUpdate(): void {
    this.host.lobby.sendRootGamePacket(new GameDataPacket([
      //@ts-ignore Talk to Cody about this?
      this.shipStatus.data(this.oldShipStatus),
    ], this.host.lobby.code));
  }
}
