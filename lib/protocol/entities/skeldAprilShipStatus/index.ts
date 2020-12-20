import { SpawnInnerNetObject, SpawnPacket } from "../../packets/gameData/spawn";
import { InnerSkeldAprilShipStatus } from "./innerSkeldAprilShipStatus";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { LobbyImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

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
