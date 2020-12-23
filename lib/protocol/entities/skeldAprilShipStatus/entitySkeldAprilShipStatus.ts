import { BaseInnerNetEntity, LobbyImplementation } from "../types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { GLOBAL_OWNER } from "../../../util/constants";
import { SpawnPacket } from "../../packets/gameData";
import { InnerSkeldAprilShipStatus } from ".";

export class EntitySkeldAprilShipStatus extends BaseInnerNetEntity {
  public innerNetObjects: [ InnerSkeldAprilShipStatus ];

  get aprilShipStatus(): InnerSkeldAprilShipStatus {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation, shipStatusNetId: number) {
    super(SpawnType.AprilShipStatus, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerSkeldAprilShipStatus(shipStatusNetId, this),
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
