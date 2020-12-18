import { SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { SystemType } from "../../../types/systemType";
import { BaseShipStatus } from "../baseShipStatus";
import { InnerNetObjectType } from "../types";
import { EntityMiraShipStatus } from ".";

export class InnerMiraShipStatus extends BaseShipStatus<InnerMiraShipStatus, EntityMiraShipStatus> {
  constructor(netId: number, public parent: EntityMiraShipStatus) {
    super(InnerNetObjectType.MiraShipStatus, netId, parent, [
      SystemType.Reactor,
      SystemType.Electrical,
      SystemType.Oxygen,
      SystemType.Medbay,
      SystemType.Communications,
      SystemType.Sabotage,
      SystemType.Decontamination,
    ], [
      SystemType.Reactor,
      SystemType.Electrical,
      SystemType.Oxygen,
      SystemType.Medbay,
      SystemType.Communications,
      SystemType.Sabotage,
    ]);
  }

  static spawn(object: SpawnInnerNetObject, parent: EntityMiraShipStatus): InnerMiraShipStatus {
    const headquarters = new InnerMiraShipStatus(object.innerNetObjectID, parent);

    headquarters.setSpawn(object.data);

    return headquarters;
  }

  clone(): InnerMiraShipStatus {
    const clone = new InnerMiraShipStatus(this.id, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
