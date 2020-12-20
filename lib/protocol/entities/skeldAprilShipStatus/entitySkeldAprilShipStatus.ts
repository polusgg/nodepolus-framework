import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { BaseEntity, LobbyImplementation } from "../types";
import { SpawnPacket } from "../../packets/gameData";
import { InnerSkeldAprilShipStatus } from ".";

export type SkeldAprilShipStatusInnerNetObjects = [ InnerSkeldAprilShipStatus ];

export class EntitySkeldAprilShipStatus extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: SkeldAprilShipStatusInnerNetObjects;

  get aprilShipStatus(): InnerSkeldAprilShipStatus {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation) {
    super(SpawnType.AprilShipStatus, lobby);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], lobby: LobbyImplementation): EntitySkeldAprilShipStatus {
    const aprilShipStatus = new EntitySkeldAprilShipStatus(lobby);

    aprilShipStatus.setSpawn(flags, owner, innerNetObjects);

    return aprilShipStatus;
  }

  getSpawn(): SpawnPacket {
    return new SpawnPacket(
      this.type,
      this.owner,
      this.flags,
      [
        this.aprilShipStatus.spawn(),
      ],
    );
  }

  setSpawn(_flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.innerNetObjects = [
      InnerSkeldAprilShipStatus.spawn(innerNetObjects[0], this),
    ];
  }
}
