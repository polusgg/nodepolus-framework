import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { InnerNetObjectType } from "../types/enums";
import { BaseShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../types/enums";
import { EntitySkeldAprilShipStatus } from ".";

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
    const clone = new InnerSkeldAprilShipStatus(this.netId, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
