import { SpawnInnerNetObject, SpawnPacket } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { InnerAirshipShipStatus } from "./innerArshipShipStatus";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { RoomImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

export type AirshipShipStatusInnerNetObjects = [ InnerAirshipShipStatus ];

export class EntityAirshipShipStatus extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: AirshipShipStatusInnerNetObjects;

  get aprilShipStatus(): InnerAirshipShipStatus {
    return this.innerNetObjects[0];
  }

  constructor(room: RoomImplementation) {
    super(SpawnType.AprilShipStatus, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityAirshipShipStatus {
    const aprilShipStatus = new EntityAirshipShipStatus(room);

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
      InnerAirshipShipStatus.spawn(innerNetObjects[0], this),
    ];
  }
}
