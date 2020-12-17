import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { SystemType } from "../../../types/systemType";
import { BaseShipStatus } from "../baseShipStatus";
import { InnerNetObjectType } from "../types";
import { EntityAirshipShipStatus } from ".";

export class InnerAirshipShipStatus extends BaseShipStatus<InnerAirshipShipStatus, EntityAirshipShipStatus> {
  constructor(netId: number, public parent: EntityAirshipShipStatus) {
    super(InnerNetObjectType.AprilShipStatus, netId, parent, [
      SystemType.Reactor,
      SystemType.Electrical,
      SystemType.Security,
      SystemType.Communications,
      SystemType.Doors,
      SystemType.Sabotage,
      SystemType.Weapons,
    ]);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityAirshipShipStatus): InnerAirshipShipStatus {
    const aprilShipStatus = new InnerAirshipShipStatus(object.innerNetObjectID, parent);

    aprilShipStatus.setSpawn(object.data);

    return aprilShipStatus;
  }

  clone(): InnerAirshipShipStatus {
    const clone = new InnerAirshipShipStatus(this.id, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
