import { SpawnInnerNetObject } from "../../packets/gameData/spawn";
import { BaseShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../types/enums";
import { InnerNetObjectType } from "../types";
import { EntityAirshipStatus } from ".";

export class InnerAirshipStatus extends BaseShipStatus<InnerAirshipStatus, EntityAirshipStatus> {
  constructor(netId: number, public parent: EntityAirshipStatus) {
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
    const clone = new InnerAirshipStatus(this.id, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
