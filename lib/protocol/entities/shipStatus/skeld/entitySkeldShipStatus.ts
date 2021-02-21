import { BaseEntityShipStatus } from "../baseShipStatus";
import { LobbyInstance } from "../../../../api/lobby";
import { SpawnType } from "../../../../types/enums";
import { InnerSkeldShipStatus } from ".";

export class EntitySkeldShipStatus extends BaseEntityShipStatus {
  constructor(lobby: LobbyInstance, shipStatusNetId: number) {
    super(SpawnType.SkeldShipStatus, lobby);

    this.shipStatus = new InnerSkeldShipStatus(shipStatusNetId, this);
  }
}
