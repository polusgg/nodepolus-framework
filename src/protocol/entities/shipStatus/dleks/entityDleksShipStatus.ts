import { BaseEntityShipStatus } from "../baseShipStatus";
import { LobbyInstance } from "../../../../api/lobby";
import { SpawnType } from "../../../../types/enums";
import { InnerDleksShipStatus } from ".";

export class EntityDleksShipStatus extends BaseEntityShipStatus {
  constructor(
    lobby: LobbyInstance,
    shipStatusNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(SpawnType.DleksShipStatus, lobby);

    this.shipStatus = new InnerDleksShipStatus(this, shipStatusNetId);
  }
}
