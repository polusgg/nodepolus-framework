import { BaseEntityShipStatus } from "../baseShipStatus";
import { LobbyInstance } from "../../../../api/lobby";
import { SpawnType } from "../../../../types/enums";
import { InnerPolusShipStatus } from ".";

export class EntityPolusShipStatus extends BaseEntityShipStatus {
  constructor(
    lobby: LobbyInstance,
    shipStatusNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(SpawnType.PolusShipStatus, lobby);

    this.shipStatus = new InnerPolusShipStatus(this, shipStatusNetId);
  }
}
