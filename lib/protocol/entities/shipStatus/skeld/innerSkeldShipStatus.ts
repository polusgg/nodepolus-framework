import { InnerNetObjectType, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { EntitySkeldShipStatus } from ".";

export class InnerSkeldShipStatus extends BaseInnerShipStatus {
  constructor(
    protected readonly parent: EntitySkeldShipStatus,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.SkeldShipStatus, parent, [
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

  getParent(): EntitySkeldShipStatus {
    return this.parent;
  }

  clone(): InnerSkeldShipStatus {
    return new InnerSkeldShipStatus(this.parent, this.netId);
  }
}
