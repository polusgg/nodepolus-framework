import { BaseInnerShipStatus } from "./baseInnerShipStatus";
import { SpawnType, SpawnFlag } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnPacket } from "../../packets/gameData";
import { LobbyInstance } from "../../../api/lobby";
import { BaseInnerNetEntity } from "../types";

export abstract class BaseEntityShipStatus extends BaseInnerNetEntity {
  protected shipStatus?: BaseInnerShipStatus;

  constructor(type: SpawnType, lobby: LobbyInstance) {
    super(type, lobby, GLOBAL_OWNER, SpawnFlag.None);
  }

  abstract serializeSpawn(): SpawnPacket;

  getShipStatus(): BaseInnerShipStatus {
    if (this.shipStatus) {
      return this.shipStatus;
    }

    throw new Error("ShipStatus does not have an InnerShipStatus instance");
  }
}
