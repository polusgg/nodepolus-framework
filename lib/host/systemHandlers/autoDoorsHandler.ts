import { BaseInnerShipStatus } from "../../protocol/entities/shipStatus/baseShipStatus";
import { AutoDoorsSystem } from "../../protocol/entities/shipStatus/systems";
import { GameDataPacket } from "../../protocol/packets/root";
import { SystemType } from "../../types/enums";
import { Doors } from "../../static";
import { InternalHost } from "..";

export class AutoDoorsHandler {
  protected readonly systemTimers: NodeJS.Timeout[] = [];

  protected oldShipStatus: BaseInnerShipStatus;

  constructor(
    protected host: InternalHost,
    protected shipStatus: BaseInnerShipStatus,
  ) {
    this.oldShipStatus = shipStatus.clone();
  }

  closeDoor(doorIds: number | number[], state: boolean = false): void {
    this.setOldShipStatus();

    const autoDoorsSystem = this.shipStatus.getSystemFromType(SystemType.Doors) as AutoDoorsSystem;

    if (doorIds instanceof Array) {
      for (let i = 0; i < doorIds.length; i++) {
        const id = doorIds[i];

        autoDoorsSystem.setDoorState(id, state);
      }
    } else {
      autoDoorsSystem.setDoorState(doorIds, state);
    }

    this.sendDataUpdate();
  }

  openDoor(doorIds: number | number[]): void {
    this.closeDoor(doorIds, true);
  }

  getDoorsForSystem(systemId: SystemType): number[] {
    const doors = Doors.forLevel(this.host.getLobby().getLevel())[systemId];

    if (!doors) {
      throw new Error(`SystemType ${systemId} (${SystemType[systemId]}) does not have any doors`);
    }

    return doors as number[];
  }

  setSystemTimeout(systemId: SystemType, time: number): this {
    this.setOldShipStatus();

    this.systemTimers[systemId] = setInterval(() => {
      this.openDoor(this.getDoorsForSystem(systemId));
    }, time * 1000);

    this.sendDataUpdate();

    return this;
  }

  setOldShipStatus(): this {
    this.oldShipStatus = this.shipStatus.clone();

    return this;
  }

  sendDataUpdate(): void {
    this.host.getLobby().sendRootGamePacket(new GameDataPacket([
      this.shipStatus.serializeData(this.oldShipStatus),
    ], this.host.getLobby().getCode()));
  }
}
