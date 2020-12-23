import { BaseInnerNetEntity, LobbyImplementation } from "../types";
import { SpawnType, SpawnFlag } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnPacket } from "../../packets/gameData";
import { BaseInnerShipStatus } from "./baseInnerShipStatus";

export abstract class BaseEntityShipStatus extends BaseInnerNetEntity {
  protected shipStatus?: BaseInnerShipStatus;

  constructor(type: SpawnType, lobby: LobbyImplementation) {
    super(type, lobby, GLOBAL_OWNER, SpawnFlag.None);
  }

  abstract serializeSpawn(): SpawnPacket;

  getShipStatus(): BaseInnerShipStatus {
    if (this.shipStatus) {
      return this.shipStatus;
    }

    throw new Error("");
  }
}
