import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { SystemType } from "../../../types/systemType";
import { BaseShipStatus } from "../baseShipStatus";
import { InnerNetObjectType } from "../types";
import { EntityShipStatus } from ".";

export class InnerShipStatus extends BaseShipStatus<InnerShipStatus, EntityShipStatus> {
  constructor(netId: number, parent: EntityShipStatus) {
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

  static spawn(object: SpawnInnerNetObject, parent: EntityShipStatus) {
    let shipStatus = new InnerShipStatus(object.innerNetObjectID, parent);

    shipStatus.setSpawn(object.data);

    return shipStatus;
  }
}
