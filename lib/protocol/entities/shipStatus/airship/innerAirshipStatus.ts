import { InnerNetObjectType, SystemType } from "../../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { EntityAirshipStatus } from ".";

export class InnerAirshipStatus extends BaseInnerShipStatus {
  constructor(
    public readonly parent: EntityAirshipStatus,
    netId: number = parent.lobby.getHostInstance().getNextNetId(),
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

  clone(): InnerAirshipStatus {
    const clone = new InnerAirshipStatus(this.parent, this.netId);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
