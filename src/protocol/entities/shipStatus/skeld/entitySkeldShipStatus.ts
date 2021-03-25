import { BaseEntityShipStatus } from "../baseShipStatus";
import { LobbyInstance } from "../../../../api/lobby";
import { SpawnType } from "../../../../types/enums";
import { InnerSkeldShipStatus } from ".";

export class EntitySkeldShipStatus extends BaseEntityShipStatus {
  constructor(
    lobby: LobbyInstance,
    shipStatusNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(SpawnType.SkeldShipStatus, lobby);

    this.shipStatus = new InnerSkeldShipStatus(this, shipStatusNetId);
  }
}
