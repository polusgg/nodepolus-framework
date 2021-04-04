import { MessageWriter } from "../../../../util/hazelMessage";
import { Level, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { StaticRooms } from "../../../../static/doors";
import { Bitfield } from "../../../../types";
import { BaseSystem } from ".";

export class ElectricalDoorsSystem extends BaseSystem {
  constructor(
    shipStatus: BaseInnerShipStatus,
    protected doors: Bitfield = StaticRooms.generatePathForLevel(Level.Airship),
  ) {
    super(shipStatus, SystemType.Decontamination);
  }

  serializeData(): MessageWriter {
    return this.serializeSpawn();
  }

  serializeSpawn(): MessageWriter {
    return new MessageWriter().writeUInt32(this.doors.toNumber());
  }

  equals(old: ElectricalDoorsSystem): boolean {
    if (!this.doors.equals(old.doors)) {
      return false;
    }

    return true;
  }

  clone(): ElectricalDoorsSystem {
    return new ElectricalDoorsSystem(this.shipStatus, this.doors.clone());
  }
}
