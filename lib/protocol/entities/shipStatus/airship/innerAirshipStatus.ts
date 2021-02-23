import { InnerNetObjectType, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { EntityAirshipStatus } from ".";

export class InnerAirshipStatus extends BaseInnerShipStatus {
  constructor(
    protected readonly parent: EntityAirshipStatus,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.DleksShipStatus, parent, [
      SystemType.Reactor,
      SystemType.Electrical,
      SystemType.Security,
      SystemType.Communications,
      SystemType.Doors,
      SystemType.Sabotage,
      SystemType.Weapons,
    ], undefined, netId);
  }

  getParent(): EntityAirshipStatus {
    return this.parent;
  }

  clone(): InnerAirshipStatus {
    return new InnerAirshipStatus(this.parent, this.netId);
  }
}
