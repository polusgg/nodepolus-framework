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

  clone(): InnerPolusShipStatus {
    const clone = new InnerPolusShipStatus(this.parent, this.netId);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }

  getParent(): EntityPolusShipStatus {
    return this.parent;
  }
}
