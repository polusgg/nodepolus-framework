import { BaseEntityShipStatus } from "../baseShipStatus/baseEntityShipStatus";
import { SpawnPacket } from "../../packets/gameData";
import { SpawnType } from "../../../types/enums";
import { LobbyImplementation } from "../types";
import { InnerPolusShipStatus } from ".";

export class EntityPolusShipStatus extends BaseEntityShipStatus {
  constructor(lobby: LobbyImplementation, shipStatusNetId: number) {
    super(SpawnType.PlanetMap, lobby);

    this.shipStatus = new InnerPolusShipStatus(shipStatusNetId, this);
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.PlanetMap,
      this.owner,
      this.flags,
      [
        this.getShipStatus().serializeSpawn(),
      ],
    );
  }
}
