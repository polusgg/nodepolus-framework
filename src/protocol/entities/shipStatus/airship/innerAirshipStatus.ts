import { InnerNetObjectType, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { EntityAirshipStatus } from ".";

export class InnerAirshipStatus extends BaseInnerShipStatus {
  constructor(
    protected readonly parent: EntityAirshipStatus,
    netId: number = parent.getLobby().getHostInstance().getNextNetId(),
  ) {
    super(InnerNetObjectType.AirshipStatus, parent, [
      SystemType.Sabotage,
      SystemType.Electrical,
      SystemType.Medbay,
      SystemType.Doors,
      SystemType.Communications,
      SystemType.GapRoom,
      SystemType.Reactor,
      SystemType.Decontamination,
      SystemType.Decontamination2,
      SystemType.Security,
    ], undefined, netId);
  }

  getParent(): EntityAirshipStatus {
    return this.parent;
  }

  clone(): InnerAirshipStatus {
    const clone = new InnerAirshipStatus(this.parent, this.netId);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
