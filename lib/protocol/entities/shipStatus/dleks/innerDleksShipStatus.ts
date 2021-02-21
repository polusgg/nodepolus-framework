import { InnerNetObjectType, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { EntityDleksShipStatus } from ".";

export class InnerDleksShipStatus extends BaseInnerShipStatus {
  constructor(
    netId: number,
    public readonly parent: EntityDleksShipStatus,
  ) {
    super(InnerNetObjectType.DleksShipStatus, netId, parent, [
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

  clone(): InnerDleksShipStatus {
    const clone = new InnerDleksShipStatus(this.netId, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
