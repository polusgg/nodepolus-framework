import { InnerLevel } from "../../protocol/entities/types";
import { CustomHost } from "..";
import { GameDataPacket } from "../../protocol/packets/rootGamePackets/gameData";
import { SystemType } from "../../types/systemType";
import { DoorsSystem, SYSTEM_DOORS } from "../../protocol/entities/baseShipStatus/systems/doorsSystem";

export class DoorSystem {
  private oldShipStatus: InnerLevel;
  private readonly systemTimers: NodeJS.Timeout[] = [];

  constructor(public host: CustomHost, public shipStatus: InnerLevel) {
    this.oldShipStatus = shipStatus.clone();
  }

  closeDoor(doorId: number | number[]): void {
    this.setOldShipStatus();

    const internalDoorsSystem = this.shipStatus.getSystemFromType(SystemType.Doors) as DoorsSystem;

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

  setSystemTimeout(systemId: SystemType, time: number): void {
    this.setOldShipStatus();

    const internalDoorsSystem = this.shipStatus.getSystemFromType(SystemType.Doors) as DoorsSystem;

    internalDoorsSystem.timers.set(systemId, time);

    this.systemTimers[systemId] = setInterval(() => {
      let currentTime = internalDoorsSystem.timers.get(systemId);

      if (currentTime && currentTime != 0) {
        internalDoorsSystem.timers.set(systemId, --currentTime);
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
    this.host.room.sendRootGamePacket(new GameDataPacket([
      //@ts-ignore Talk to Cody about this?
      this.shipStatus.data(this.oldShipStatus),
    ], this.host.room.code));
  }
}
