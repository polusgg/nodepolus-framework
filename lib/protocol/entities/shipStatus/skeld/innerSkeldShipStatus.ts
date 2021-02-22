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

  clone(): InnerSkeldShipStatus {
    const clone = new InnerSkeldShipStatus(this.parent, this.netId);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }

  getParent(): EntitySkeldShipStatus {
    return this.parent;
  }
}
