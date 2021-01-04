import { BaseInnerShipStatus } from "../baseShipStatus";
import { InnerNetObjectType } from "../types/enums";
import { SystemType } from "../../../types/enums";
import { EntityPolusShipStatus } from ".";

export class InnerPolusShipStatus extends BaseInnerShipStatus {
  constructor(
    netId: number,
    public readonly parent: EntityPolusShipStatus,
  ) {
    super(InnerNetObjectType.PolusShipStatus, netId, parent, [
      SystemType.Electrical,
      SystemType.Medbay,
      SystemType.Security,
      SystemType.Communications,
      SystemType.Doors,
      SystemType.Decontamination,
      SystemType.Decontamination2,
      SystemType.Sabotage,
      SystemType.Laboratory,
    ]);
  }

  clone(): InnerPolusShipStatus {
    const clone = new InnerPolusShipStatus(this.netId, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
