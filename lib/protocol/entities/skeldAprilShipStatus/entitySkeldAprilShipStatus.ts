import { BaseEntityShipStatus } from "../baseShipStatus/baseEntityShipStatus";
import { SpawnPacket } from "../../packets/gameData";
import { SpawnType } from "../../../types/enums";
import { LobbyInstance } from "../../../lobby";
import { InnerSkeldAprilShipStatus } from ".";

export class EntitySkeldAprilShipStatus extends BaseEntityShipStatus {
  constructor(lobby: LobbyInstance, shipStatusNetId: number) {
    super(SpawnType.AprilShipStatus, lobby);

    this.shipStatus = new InnerSkeldAprilShipStatus(shipStatusNetId, this);
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      this.type,
      this.owner,
      this.flags,
      [
        this.getShipStatus().serializeSpawn(),
      ],
    );
  }
}
