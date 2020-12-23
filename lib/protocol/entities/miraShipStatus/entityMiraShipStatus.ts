import { BaseEntityShipStatus } from "../baseShipStatus/baseEntityShipStatus";
import { SpawnPacket } from "../../packets/gameData";
import { SpawnType } from "../../../types/enums";
import { LobbyImplementation } from "../types";
import { InnerMiraShipStatus } from ".";

export class EntityMiraShipStatus extends BaseEntityShipStatus {
  constructor(lobby: LobbyImplementation, shipStatusNetId: number) {
    super(SpawnType.Headquarters, lobby);

    this.shipStatus = new InnerMiraShipStatus(shipStatusNetId, this);
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.Headquarters,
      this.owner,
      this.flags,
      [
        this.getShipStatus().serializeSpawn(),
      ],
    );
  }
}
