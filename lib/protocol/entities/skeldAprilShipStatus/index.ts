import { SpawnInnerNetObject, SpawnPacket } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { InnerSkeldAprilShipStatus } from "./innerSkeldAprilShipStatus";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
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

  constructor(room: LobbyImplementation) {
    super(SpawnType.AprilShipStatus, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: LobbyImplementation): EntitySkeldAprilShipStatus {
    const aprilShipStatus = new EntitySkeldAprilShipStatus(room);

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
