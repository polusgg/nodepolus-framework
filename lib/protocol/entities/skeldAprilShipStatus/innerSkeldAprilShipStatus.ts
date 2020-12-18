import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { SystemType } from "../../../types/systemType";
import { BaseShipStatus } from "../baseShipStatus";
import { EntitySkeldAprilShipStatus } from ".";
import { InnerNetObjectType } from "../types";

export class InnerSkeldAprilShipStatus extends BaseShipStatus<InnerSkeldAprilShipStatus, EntitySkeldAprilShipStatus> {
  constructor(netId: number, public parent: EntitySkeldAprilShipStatus) {
    super(InnerNetObjectType.SkeldAprilShipStatus, netId, parent, [
      SystemType.Reactor,
      SystemType.Electrical,
      SystemType.Oxygen,
      SystemType.Medbay,
      SystemType.Security,
      SystemType.Communications,
      SystemType.Doors,
      SystemType.Sabotage,
    ]);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntitySkeldAprilShipStatus): InnerSkeldAprilShipStatus {
    const aprilShipStatus = new InnerSkeldAprilShipStatus(object.innerNetObjectID, parent);

    aprilShipStatus.setSpawn(object.data);

    return aprilShipStatus;
  }

  clone(): InnerSkeldAprilShipStatus {
    const clone = new InnerSkeldAprilShipStatus(this.id, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
