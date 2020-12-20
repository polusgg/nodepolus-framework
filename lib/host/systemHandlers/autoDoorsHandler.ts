import { AutoDoorsSystem, SYSTEM_DOORS_AUTO } from "../../protocol/entities/baseShipStatus/systems/autoDoorsSystem";
import { GameDataPacket } from "../../protocol/packets/root/gameData";
import { InnerLevel } from "../../protocol/entities/types";
import { SystemType } from "../../types/enums";
import { CustomHost } from "..";

export class AutoDoorsHandler {
  private readonly systemTimers: NodeJS.Timeout[] = [];

  private oldShipStatus: InnerLevel;

  constructor(
    public host: CustomHost,
    public shipStatus: InnerLevel,
  ) {
    this.oldShipStatus = shipStatus.clone();
  }

  closeDoor(doorIds: number | number[], state: boolean = false): void {
    this.setOldShipStatus();

    const autoDoorsSystem = this.shipStatus.getSystemFromType(SystemType.Doors) as AutoDoorsSystem;

    if (doorIds instanceof Array) {
      for (let i = 0; i < doorIds.length; i++) {
        const id = doorIds[i];

        autoDoorsSystem.doors[id] = state;
      }
    } else {
      autoDoorsSystem.doors[doorIds] = state;
    }

    this.sendDataUpdate();
  }

  openDoor(doorIds: number | number[]): void {
    this.closeDoor(doorIds, true);
  }

  getDoorsForSystem(systemId: SystemType): number[] {
    const doors = SYSTEM_DOORS_AUTO.get(systemId);

    if (!doors) {
      throw new Error(`SystemType ${systemId} (${SystemType[systemId]}) does not have any doors`);
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
    this.host.lobby.sendRootGamePacket(new GameDataPacket([
      //@ts-ignore Talk to Cody about this?
      this.shipStatus.getData(this.oldShipStatus),
    ], this.host.lobby.code));
  }
}
