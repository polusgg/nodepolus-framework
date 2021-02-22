import { BaseEntityShipStatus } from "../baseShipStatus";
import { LobbyInstance } from "../../../../api/lobby";
import { SpawnType } from "../../../../types/enums";
import { InnerAirshipStatus } from ".";

export class EntityAirshipStatus extends BaseEntityShipStatus {
  constructor(
    lobby: LobbyInstance,
    shipStatusNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(SpawnType.AirshipStatus, lobby);

    this.shipStatus = new InnerAirshipStatus(this, shipStatusNetId);
  }
}
