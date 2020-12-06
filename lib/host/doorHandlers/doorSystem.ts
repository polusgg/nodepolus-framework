import { EntityLevel } from "../../protocol/entities/types";
import cloneDeep from "lodash.clonedeep";
import { CustomHost } from "..";
import { GameDataPacket } from "../../protocol/packets/rootGamePackets/gameData";
import { SystemType } from "../../types/systemType";
import { DoorsSystem, SYSTEM_DOORS } from "../../protocol/entities/baseShipStatus/systems/doorsSystem";

export class DoorSystem {
  private oldShipStatus: EntityLevel;
  private readonly systemTimers: NodeJS.Timeout[] = [];

  constructor(public host: CustomHost, public shipStatus: EntityLevel) {
    this.oldShipStatus = cloneDeep(shipStatus);
  }

  closeDoor(doorId: number | number[]): void {
    this.setOldShipStatus();

    const internalDoorsSystem = this.shipStatus.innerNetObjects[0].getSystemFromType(SystemType.Doors) as DoorsSystem;

    if (doorId instanceof Array) {
      for (let i = 0; i < doorId.length; i++) {
        const singleId = doorId[i];

        internalDoorsSystem.doorStates[singleId] = false;
      }
    } else {
      internalDoorsSystem.doorStates[doorId] = false;
    }

    this.sendDataUpdate();
  }

  getDoorsForSystem(systemId: SystemType): number[] {
    const doors = SYSTEM_DOORS.get(systemId);

    if (!doors) {
      throw new Error(`getDoorsForSystem called with a systemId (${systemId}, ${SystemType[systemId]}) that does not have door mappings.`);
    }

    return doors;
  }

  setSystemTimeout(systemId: SystemType, time: number) {
    const internalDoorsSystem = this.shipStatus.innerNetObjects[0].getSystemFromType(SystemType.Doors) as DoorsSystem;

    internalDoorsSystem.timers.set(systemId, time);

    this.systemTimers[systemId] = setInterval(() => {
      let currentTime = internalDoorsSystem.timers.get(systemId);

      if (currentTime && currentTime != 0) {
        internalDoorsSystem.timers.set(systemId, --currentTime);
      } else {
        clearInterval(this.systemTimers[systemId]);
      }
    }, 1000);
  }

  setOldShipStatus(): void {
    this.oldShipStatus = cloneDeep(this.shipStatus);
  }

  sendDataUpdate(): void {
    this.host.room.sendRootGamePacket(new GameDataPacket([
      this.shipStatus.innerNetObjects[0].data(this.oldShipStatus.innerNetObjects[0]),
    ], this.host.room.code));
  }
}
