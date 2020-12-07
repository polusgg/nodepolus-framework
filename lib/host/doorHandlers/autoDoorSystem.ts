import { InnerLevel } from "../../protocol/entities/types";
import { CustomHost } from "..";
import { GameDataPacket } from "../../protocol/packets/rootGamePackets/gameData";
import { SystemType } from "../../types/systemType";
import { AutoDoorsSystem, SYSTEM_DOORS_AUTO } from "../../protocol/entities/baseShipStatus/systems/autoDoorsSystem";

export class AutoDoorSystem {
  private oldShipStatus: InnerLevel;
  private readonly systemTimers: NodeJS.Timeout[] = [];

  constructor(public host: CustomHost, public shipStatus: InnerLevel) {
    this.oldShipStatus = shipStatus.clone();
  }

  closeDoor(doorId: number | number[], state: boolean = false): void {
    this.setOldShipStatus();

    const internalDoorsSystem = this.shipStatus.getSystemFromType(SystemType.Doors) as AutoDoorsSystem;

    if (doorId instanceof Array) {
      for (let i = 0; i < doorId.length; i++) {
        const singleId = doorId[i];

        internalDoorsSystem.doors[singleId] = state;
      }
    } else {
      internalDoorsSystem.doors[doorId] = state;
    }

    this.sendDataUpdate();
  }

  openDoor(doorId: number | number[]): void {
    this.closeDoor(doorId, true);
  }

  getDoorsForSystem(systemId: SystemType): number[] {
    const doors = SYSTEM_DOORS_AUTO.get(systemId);

    if (!doors) {
      throw new Error(`getDoorsForSystem called with a systemId (${systemId}, ${SystemType[systemId]}) that does not have door mappings.`);
    }

    return doors;
  }

  setSystemTimeout(systemId: SystemType, time: number): void {
    this.setOldShipStatus();

    this.systemTimers[systemId] = setInterval(() => {
      this.openDoor(this.getDoorsForSystem(systemId));
    }, time * 1000);

    this.sendDataUpdate();
  }

  setOldShipStatus(): void {
    this.oldShipStatus = this.shipStatus.clone();
  }

  sendDataUpdate(): void {
    this.host.room.sendRootGamePacket(new GameDataPacket([
      //@ts-ignore Talk to Cody about this?
      this.shipStatus.getData(this.oldShipStatus),
    ], this.host.room.code));
  }
}
