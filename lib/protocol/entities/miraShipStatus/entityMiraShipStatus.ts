import { BaseInnerNetEntity, LobbyImplementation } from "../types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnPacket } from "../../packets/gameData";
import { InnerMiraShipStatus } from ".";

export class EntityMiraShipStatus extends BaseInnerNetEntity {
  public innerNetObjects: [ InnerMiraShipStatus ];

  get headquarters(): InnerMiraShipStatus {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation, shipStatusNetId: number) {
    super(SpawnType.Headquarters, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerMiraShipStatus(shipStatusNetId, this),
    ];
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.Headquarters,
      this.owner,
      this.flags,
      [
        this.headquarters.serializeSpawn(),
      ],
    );
  }
}
