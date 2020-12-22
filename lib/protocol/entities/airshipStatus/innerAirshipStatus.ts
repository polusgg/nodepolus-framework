import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { InnerNetObjectType } from "../types/enums";
import { BaseShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../types/enums";
import { EntityAirshipStatus } from ".";

export class InnerAirshipStatus extends BaseShipStatus {
  constructor(
    netId: number,
    public parent: EntityAirshipStatus,
  ) {
    super(InnerNetObjectType.SkeldAprilShipStatus, netId, parent, [
      SystemType.Reactor,
      SystemType.Electrical,
      SystemType.Security,
      SystemType.Communications,
      SystemType.Doors,
      SystemType.Sabotage,
      SystemType.Weapons,
    ]);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityAirshipStatus): InnerAirshipStatus {
    const airship = new InnerAirshipStatus(object.innerNetObjectID, parent);

    airship.setSpawn(object.data);

    return airship;
  }

  clone(): InnerAirshipStatus {
    const clone = new InnerAirshipStatus(this.netId, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
