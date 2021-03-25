import { BaseEntityShipStatus } from "../baseShipStatus";
import { LobbyInstance } from "../../../../api/lobby";
import { SpawnType } from "../../../../types/enums";
import { InnerMiraShipStatus } from ".";

export class EntityMiraShipStatus extends BaseEntityShipStatus {
  constructor(
    lobby: LobbyInstance,
    shipStatusNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(SpawnType.MiraShipStatus, lobby);

    this.shipStatus = new InnerMiraShipStatus(this, shipStatusNetId);
  }
}
