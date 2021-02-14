import { BaseEntityShipStatus } from "../baseShipStatus/baseEntityShipStatus";
import { LobbyInstance } from "../../../api/lobby";
import { SpawnType } from "../../../types/enums";
import { InnerMiraShipStatus } from ".";

export class EntityMiraShipStatus extends BaseEntityShipStatus {
  constructor(lobby: LobbyInstance, shipStatusNetId: number) {
    super(SpawnType.MiraShipStatus, lobby);

    this.shipStatus = new InnerMiraShipStatus(shipStatusNetId, this);
  }
}
