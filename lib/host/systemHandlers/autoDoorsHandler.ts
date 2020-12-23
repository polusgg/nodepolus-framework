import { AutoDoorsSystem } from "../../protocol/entities/baseShipStatus/systems";
import { BaseInnerShipStatus } from "../../protocol/entities/baseShipStatus";
import { GameDataPacket } from "../../protocol/packets/root";
import { SystemDoors } from "../../static/doors";
import { SystemType } from "../../types/enums";
import { CustomHost } from "..";

export class AutoDoorsHandler {
  private readonly systemTimers: NodeJS.Timeout[] = [];

  private oldShipStatus: BaseInnerShipStatus;

  constructor(
    public host: CustomHost,
    public shipStatus: BaseInnerShipStatus,
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
    const doors = SystemDoors.forLevel(this.host.lobby.options.levels[0])[systemId];

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
      this.shipStatus.getData(this.oldShipStatus),
    ], this.host.lobby.code));
  }
}
