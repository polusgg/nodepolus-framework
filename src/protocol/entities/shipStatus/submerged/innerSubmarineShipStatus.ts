import { InnerNetObjectType, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { EntitySubmarineShipStatus } from "./entitySubmarineShipStatus";

export class InnerSubmarineShipStatus extends BaseInnerShipStatus {
  constructor(
    protected readonly parent: EntitySubmarineShipStatus,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.SubmergedStatus, parent, [
      SystemType.Sabotage,
      SystemType.Communications,
      SystemType.Doors,
      SystemType.Electrical,
      SystemType.Medbay,
      SystemType.Reactor,
      SystemType.Security,
      SystemType.Oxygen,
      SystemType.SubmergedElevatorWestLeft,
      SystemType.SubmergedElevatorWestRight,
      SystemType.SubmergedElevatorEastLeft,
      SystemType.SubmergedElevatorEastRight,
      SystemType.SubmergedElevatorService,
      SystemType.SubmergedFloor,
      SystemType.SubmergedSecuritySabotage,
      SystemType.SubmergedSpawnIn,
      SystemType.Decontamination,
      SystemType.Decontamination2,
    ], undefined, netId);
  }

  getParent(): EntitySubmarineShipStatus {
    return this.parent;
  }

  clone(): InnerSubmarineShipStatus {
    const clone = new InnerSubmarineShipStatus(this.parent, this.netId);

    clone.systems = this.systems.map(s => s.clone());

    return clone;
  }
}
