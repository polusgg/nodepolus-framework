import { BaseInnerShipStatus } from "../../protocol/entities/shipStatus/baseShipStatus";
import { AutoDoorsSystem } from "../../protocol/entities/shipStatus/systems";
import { GameDataPacket } from "../../protocol/packets/root";
import { SystemType } from "../../types/enums";
import { Doors } from "../../static";
import { Host } from "..";
import { RoomDoorsOpenedEvent } from "../../api/events/room";

export class AutoDoorsHandler {
  protected readonly systemTimers: NodeJS.Timeout[] = [];

  protected oldShipStatus: BaseInnerShipStatus;

  constructor(
    protected host: Host,
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

  async openDoor(doorIds: number | number[]): Promise<void> {
    if (!(doorIds instanceof Array)) { doorIds = [doorIds] }

    const event = new RoomDoorsOpenedEvent(this.host.getLobby().getSafeGame(), doorIds);

    await this.host.getLobby().getServer().emit("room.doors.opened", event);

    if (event.isCancelled()) {
      return;
    }
    this.closeDoor(doorIds, true);
  }

  getDoorsForSystem(systemId: SystemType): number[] {
    const doors = Doors.forLevel(this.host.getLobby().getLevel())[systemId];

    if (doors === undefined) {
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

  clearTimers(): void {
    for (let i = 0; i < this.systemTimers.length; i++) {
      clearInterval(this.systemTimers[i]);
    }

    this.systemTimers.splice(0, this.systemTimers.length);
  }
}
