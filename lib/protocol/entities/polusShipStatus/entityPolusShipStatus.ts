import { BaseInnerNetEntity, LobbyImplementation } from "../types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnPacket } from "../../packets/gameData";
import { InnerPolusShipStatus } from ".";

export class EntityPolusShipStatus extends BaseInnerNetEntity {
  public innerNetObjects: [ InnerPolusShipStatus ];

  get planetMap(): InnerPolusShipStatus {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation, shipStatusNetId: number) {
    super(SpawnType.PlanetMap, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerPolusShipStatus(shipStatusNetId, this),
    ];
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.PlanetMap,
      this.owner,
      this.flags,
      [
        this.planetMap.serializeSpawn(),
      ],
    );
  }
}
