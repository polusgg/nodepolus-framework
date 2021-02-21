import { InnerNetObjectType, SystemType } from "../../../types/enums";
import { BaseInnerShipStatus } from "../baseShipStatus";
import { EntityAirshipStatus } from ".";

export class InnerAirshipStatus extends BaseInnerShipStatus {
  constructor(
    netId: number,
    public readonly parent: EntityAirshipStatus,
  ) {
    super(InnerNetObjectType.SkeldAprilShipStatus, netId, parent, [
      SystemType.Reactor,
      SystemType.Electrical,
      SystemType.Security,
      SystemType.Communications,
      SystemType.Doors,
      SystemType.Sabotage,
      SystemType.Weapons,
    ]);
  }

  clone(): InnerAirshipStatus {
    const clone = new InnerAirshipStatus(this.netId, this.parent);

    clone.systems = this.systems.map(system => system.clone());

    return clone;
  }
}
