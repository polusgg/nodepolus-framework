import { StaticRoomList, StaticRooms, StaticDoorsAirship } from "../../../../static/doors";
import { Level, SystemType } from "../../../../types/enums";
import { MessageWriter } from "../../../../util/hazelMessage";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { BaseSystem } from "./baseSystem";

export class ElectricalDoorsSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected doors: boolean[] = ElectricalDoorsSystem.initializeDoors(StaticRooms.forLevel(Level.Airship)),
  ) {
    super(shipStatus, SystemType.Decontamination);
  }

  static initializeDoors(rooms: Readonly<StaticRoomList>): boolean[] {
    const doorStates: boolean[] = [];
    const hashSet = new Set<[string, readonly number[]]>();
    const doorIds: number[] = [...new Set(Object.values(rooms).flat())];

    // Close all doors
    for (let i = 0; i < doorIds.length; i++) {
      doorStates[doorIds[i]] = false;
    }

    let room: [string, readonly number[]] = [Object.keys(rooms)[0], rooms[Object.keys(rooms)[0]]];

    while (hashSet.size < Object.keys(rooms).length) {
      const door = room[1][Math.floor(Math.random() * room.length)];
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      const doorSet = Object.entries(rooms).find(([name, roomDoors]) => name != room[0] && roomDoors.includes(door))!;

      if (!hashSet.has(doorSet)) {
        hashSet.add(doorSet);
        doorStates[door] = true;
      }

      if (Math.random() > 0.5) {
        room = doorSet;
      }
    }

    const flag = Math.random() > 0.5;

    doorStates[StaticDoorsAirship.LeftDoorTop] = flag;
    doorStates[StaticDoorsAirship.LeftDoorBottom] = !flag;

    return doorStates;
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    const message = new MessageWriter();

    let doorsBitfield = 0;

    for (let i = 0; i < this.doors.length; i++) {
      doorsBitfield |= (this.doors[i] ? 1 : 0) << i;
    }

    message.writeUInt32(doorsBitfield);

    return message;
  }

  clone(): ElectricalDoorsSystem {
    return new ElectricalDoorsSystem(this.shipStatus, this.doors.map(d => d));
  }

  equals(old: ElectricalDoorsSystem): boolean {
    return this.doors.every((door, index) => old.doors[index] == door);
  }
}
