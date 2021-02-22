import { InnerNetObjectType, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { EntityDleksShipStatus } from ".";

export class InnerDleksShipStatus extends BaseInnerShipStatus {
  constructor(
    public readonly parent: EntityDleksShipStatus,
    netId: number = parent.lobby.getHostInstance().getNextNetId(),
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

  clone(): InnerDleksShipStatus {
    const clone = new InnerDleksShipStatus(this.parent, this.netId);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
