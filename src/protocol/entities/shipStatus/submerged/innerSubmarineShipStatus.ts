import { InnerNetObjectType, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { EntitySubmarineShipStatus } from "./entitySubmarineShipStatus";

export class InnerSubmarineShipStatus extends BaseInnerShipStatus {
  constructor(
    protected readonly parent: EntitySubmarineShipStatus,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.SubmergedStatus, parent, [
      SystemType.Communications,
      SystemType.Doors,
      SystemType.Electrical,
      SystemType.Medbay,
      SystemType.Reactor,
      SystemType.Security,
      SystemType.Oxygen,
      SystemType.ElevatorWestLeft,
      SystemType.ElevatorWestRight,
      SystemType.ElevatorEastLeft,
      SystemType.ElevatorEastRight,
      SystemType.ElevatorService,
      SystemType.SubmarineFloor,
      SystemType.SurveillanceSabotage,
      SystemType.SpawnIn,
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
