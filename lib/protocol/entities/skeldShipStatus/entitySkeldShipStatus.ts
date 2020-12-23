import { BaseInnerNetEntity, LobbyImplementation } from "../types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnPacket } from "../../packets/gameData";
import { InnerSkeldShipStatus } from ".";

export class EntitySkeldShipStatus extends BaseInnerNetEntity {
  public innerNetObjects: [ InnerSkeldShipStatus ];

  get shipStatus(): InnerSkeldShipStatus {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation, shipStatusNetId: number) {
    super(SpawnType.ShipStatus, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerSkeldShipStatus(shipStatusNetId, this),
    ];
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      this.type,
      this.owner,
      this.flags,
      [
        this.shipStatus.serializeSpawn(),
      ],
    );
  }
}
