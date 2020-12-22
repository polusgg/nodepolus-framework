import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { InnerNetObjectType } from "../types/enums";
import { BaseShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../types/enums";
import { EntityPolusShipStatus } from ".";

export class InnerPolusShipStatus extends BaseShipStatus {
  constructor(
    netId: number,
    public parent: EntityPolusShipStatus,
  ) {
    super(InnerNetObjectType.PolusShipStatus, netId, parent, [
      SystemType.Electrical,
      SystemType.Medbay,
      SystemType.Security,
      SystemType.Communications,
      SystemType.Doors,
      SystemType.Decontamination,
      SystemType.Decontamination2,
      SystemType.Sabotage,
      SystemType.Laboratory,
    ]);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityPolusShipStatus): InnerPolusShipStatus {
    const planetMap = new InnerPolusShipStatus(object.innerNetObjectID, parent);

    planetMap.setSpawn(object.data);

    return planetMap;
  }

  clone(): InnerPolusShipStatus {
    const clone = new InnerPolusShipStatus(this.netId, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
