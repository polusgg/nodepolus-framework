import { SpawnType, SpawnFlag } from "../../../../types/enums";
import { BaseInnerShipStatus } from "./baseInnerShipStatus";
import { GLOBAL_OWNER } from "../../../../util/constants";
import { SpawnPacket } from "../../../packets/gameData";
import { BaseInnerNetEntity } from "../../baseEntity";
import { LobbyInstance } from "../../../../api/lobby";

export abstract class BaseEntityShipStatus extends BaseInnerNetEntity {
  protected shipStatus?: BaseInnerShipStatus;

  constructor(type: SpawnType, lobby: LobbyInstance) {
    super(type, lobby, GLOBAL_OWNER, SpawnFlag.None);
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

  despawn(): void {
    this.lobby.despawn(this.getShipStatus());
    this.lobby.deleteShipStatus();
  }

  getShipStatus(): BaseInnerShipStatus {
    if (this.shipStatus) {
      return this.shipStatus;
    }

    throw new Error("ShipStatus does not have an InnerShipStatus instance");
  }
}
