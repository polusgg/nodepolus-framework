import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { SystemType } from "../../../types/systemType";
import { BaseShipStatus } from "../baseShipStatus";
import { InnerNetObjectType } from "../types";
import { EntityShipStatus } from ".";

export class InnerShipStatus extends BaseShipStatus<InnerShipStatus, EntityShipStatus> {
  constructor(netId: number, public parent: EntityShipStatus) {
    super(InnerNetObjectType.ShipStatus, netId, parent, [
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

  static spawn(object: SpawnInnerNetObject, parent: EntityShipStatus): InnerShipStatus {
    const shipStatus = new InnerShipStatus(object.innerNetObjectID, parent);

    shipStatus.setSpawn(object.data);

    return shipStatus;
  }

  clone(): InnerShipStatus {
    const clone = new InnerShipStatus(this.id, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
