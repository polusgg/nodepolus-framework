import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { SystemType } from "../../../types/systemType";
import { BaseShipStatus } from "../baseShipStatus";
import { InnerNetObjectType } from "../types";
import { EntityPlanetMap } from ".";

export class InnerPlanetMap extends BaseShipStatus<InnerPlanetMap, EntityPlanetMap> {
  constructor(netId: number, parent: EntityPlanetMap) {
    super(InnerNetObjectType.PlanetMap, netId, parent, [
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

  static spawn(object: SpawnInnerNetObject, parent: EntityPlanetMap): InnerPlanetMap {
    const planetMap = new InnerPlanetMap(object.innerNetObjectID, parent);

    planetMap.setSpawn(object.data);

    return planetMap;
  }
}
