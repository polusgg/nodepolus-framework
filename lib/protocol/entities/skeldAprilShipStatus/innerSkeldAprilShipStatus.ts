import { InnerNetObjectType } from "../types/enums";
import { BaseShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../types/enums";
import { EntitySkeldAprilShipStatus } from ".";

export class InnerSkeldAprilShipStatus extends BaseShipStatus {
  constructor(
    netId: number,
    public parent: EntitySkeldAprilShipStatus,
  ) {
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

  clone(): InnerSkeldAprilShipStatus {
    const clone = new InnerSkeldAprilShipStatus(this.netId, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
