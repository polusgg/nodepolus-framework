import { LobbyInstance } from "../../../../api/lobby";
import { SpawnType } from "../../../../types/enums";
import { BaseEntityShipStatus } from "../baseShipStatus";
import { InnerSubmarineShipStatus } from "./innerSubmarineShipStatus";

export class EntitySubmarineShipStatus extends BaseEntityShipStatus {
  constructor(
    lobby: LobbyInstance,
    shipStatusNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(SpawnType.SubmergedStatus, lobby);

    this.shipStatus = new InnerSubmarineShipStatus(this, shipStatusNetId);
  }
}
