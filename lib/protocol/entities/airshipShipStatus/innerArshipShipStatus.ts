import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { SystemType } from "../../../types/systemType";
import { BaseShipStatus } from "../baseShipStatus";
import { InnerNetObjectType } from "../types";
import { EntityAirship } from ".";

export class InnerAirship extends BaseShipStatus<InnerAirship, EntityAirship> {
  constructor(netId: number, public parent: EntityAirship) {
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

  static spawn(object: SpawnInnerNetObject, parent: EntityAirship): InnerAirship {
    const airship = new InnerAirship(object.innerNetObjectID, parent);

    airship.setSpawn(object.data);

    return airship;
  }

  clone(): InnerAirship {
    const clone = new InnerAirship(this.id, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
