import { BaseEntityShipStatus } from "../baseShipStatus/baseEntityShipStatus";
import { LobbyInstance } from "../../../api/lobby";
import { SpawnType } from "../../../types/enums";
import { InnerSkeldAprilShipStatus } from ".";

export class EntitySkeldAprilShipStatus extends BaseEntityShipStatus {
  constructor(lobby: LobbyInstance, shipStatusNetId: number) {
    super(SpawnType.SkeldAprilShipStatus, lobby);

    this.shipStatus = new InnerSkeldAprilShipStatus(shipStatusNetId, this);
  }
}
