import { BaseEntityShipStatus } from "../baseShipStatus";
import { LobbyInstance } from "../../../../api/lobby";
import { SpawnType } from "../../../../types/enums";
import { InnerAirshipStatus } from ".";

export class EntityAirshipStatus extends BaseEntityShipStatus {
  constructor(lobby: LobbyInstance, shipStatusNetId: number) {
    super(SpawnType.AirshipStatus, lobby);

    this.shipStatus = new InnerAirshipStatus(shipStatusNetId, this);
  }
}
