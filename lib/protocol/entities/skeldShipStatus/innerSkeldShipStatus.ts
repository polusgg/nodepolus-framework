import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { InnerNetObjectType } from "../types/enums";
import { BaseShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../types/enums";
import { EntitySkeldShipStatus } from ".";

export class InnerSkeldShipStatus extends BaseShipStatus<InnerSkeldShipStatus, EntitySkeldShipStatus> {
  constructor(netId: number, public parent: EntitySkeldShipStatus) {
    super(InnerNetObjectType.SkeldShipStatus, netId, parent, [
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

  static spawn(object: SpawnInnerNetObject, parent: EntitySkeldShipStatus): InnerSkeldShipStatus {
    const shipStatus = new InnerSkeldShipStatus(object.innerNetObjectID, parent);

    shipStatus.setSpawn(object.data);

    return shipStatus;
  }

  clone(): InnerSkeldShipStatus {
    const clone = new InnerSkeldShipStatus(this.netId, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
