import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { SystemType } from "../../../types/systemType";
import { BaseShipStatus } from "../baseShipStatus";
import { InnerNetObjectType } from "../types";
import { EntityAprilShipStatus } from ".";

export class InnerAprilShipStatus extends BaseShipStatus<InnerAprilShipStatus, EntityAprilShipStatus> {
  constructor(netId: number, parent: EntityAprilShipStatus) {
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

  static spawn(object: SpawnInnerNetObject, parent: EntityAprilShipStatus): InnerAprilShipStatus {
    const aprilShipStatus = new InnerAprilShipStatus(object.innerNetObjectID, parent);

    aprilShipStatus.setSpawn(object.data);

    return aprilShipStatus;
  }
}
