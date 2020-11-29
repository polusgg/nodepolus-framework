import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { SystemType } from "../../../types/systemType";
import { BaseShipStatus } from "../baseShipStatus";
import { InnerNetObjectType } from "../types";
import { EntityHeadquarters } from ".";

export class InnerHeadquarters extends BaseShipStatus<InnerHeadquarters, EntityHeadquarters> {
  constructor(netId: number, parent: EntityHeadquarters) {
    super(InnerNetObjectType.Headquarters, netId, parent, [
      SystemType.Reactor,
      SystemType.Electrical,
      SystemType.Oxygen,
      SystemType.Medbay,
      SystemType.Communications,
      SystemType.Sabotage,
      SystemType.Decontamination,
    ]);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityHeadquarters) {
    let headquarters = new InnerHeadquarters(object.innerNetObjectID, parent);

    headquarters.setSpawn(object.data);

    return headquarters;
  }
}
