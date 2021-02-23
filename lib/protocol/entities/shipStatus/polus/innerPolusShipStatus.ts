import { InnerNetObjectType, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { EntityPolusShipStatus } from ".";

export class InnerPolusShipStatus extends BaseInnerShipStatus {
  constructor(
    protected readonly parent: EntityPolusShipStatus,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.PolusShipStatus, parent, [
      SystemType.Electrical,
      SystemType.Medbay,
      SystemType.Security,
      SystemType.Communications,
      SystemType.Doors,
      SystemType.Decontamination,
      SystemType.Decontamination2,
      SystemType.Sabotage,
      SystemType.Laboratory,
    ], undefined, netId);
  }

  getParent(): EntityPolusShipStatus {
    return this.parent;
  }

  clone(): InnerPolusShipStatus {
    return new InnerPolusShipStatus(this.parent, this.netId);
  }
}
