import { BaseEntityShipStatus } from "../baseShipStatus/baseEntityShipStatus";
import { SpawnPacket } from "../../packets/gameData";
import { LobbyInstance } from "../../../api/lobby";
import { SpawnType } from "../../../types/enums";
import { InnerPolusShipStatus } from ".";

export class EntityPolusShipStatus extends BaseEntityShipStatus {
  constructor(lobby: LobbyInstance, shipStatusNetId: number) {
    super(SpawnType.PolusShipStatus, lobby);

    this.shipStatus = new InnerPolusShipStatus(shipStatusNetId, this);
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.PolusShipStatus,
      this.owner,
      this.flags,
      [
        this.getShipStatus().serializeSpawn(),
      ],
    );
  }
}
