import { BaseInnerNetEntity, LobbyImplementation } from "../types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnPacket } from "../../packets/gameData";
import { InnerAirshipStatus } from ".";

export class EntityAirshipStatus extends BaseInnerNetEntity {
  public innerNetObjects: [ InnerAirshipStatus ];

  get aprilShipStatus(): InnerAirshipStatus {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation, shipStatusNetId: number) {
    super(SpawnType.Airship, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerAirshipStatus(shipStatusNetId, this),
    ];
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      this.type,
      this.owner,
      this.flags,
      [
        this.aprilShipStatus.serializeSpawn(),
      ],
    );
  }
}
