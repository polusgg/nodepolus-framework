import { InnerNetObjectType, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { EntityDleksShipStatus } from ".";

export class InnerDleksShipStatus extends BaseInnerShipStatus {
  constructor(
    protected readonly parent: EntityDleksShipStatus,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.DleksShipStatus, parent, [
      SystemType.Reactor,
      SystemType.Electrical,
      SystemType.Oxygen,
      SystemType.Medbay,
      SystemType.Security,
      SystemType.Communications,
      SystemType.Doors,
      SystemType.Sabotage,
    ], undefined, netId);
  }

  getParent(): EntityDleksShipStatus {
    return this.parent;
  }

  clone(): InnerDleksShipStatus {
    const clone = new InnerDleksShipStatus(this.parent, this.netId);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
