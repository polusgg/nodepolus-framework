import { InnerNetObjectType } from "../types/enums";
import { BaseShipStatus } from "../baseShipStatus";
import { SystemType } from "../../../types/enums";
import { EntitySkeldShipStatus } from ".";

export class InnerSkeldShipStatus extends BaseShipStatus {
  constructor(
    netId: number,
    public parent: EntitySkeldShipStatus,
  ) {
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

  clone(): InnerSkeldShipStatus {
    const clone = new InnerSkeldShipStatus(this.netId, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
