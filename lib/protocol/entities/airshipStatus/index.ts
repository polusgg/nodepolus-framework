import { SpawnInnerNetObject, SpawnPacket } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { InnerAirshipStatus } from "./innerAirshipStatus";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { RoomImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

export type AirshipInnerNetObjects = [ InnerAirshipStatus ];

export class EntityAirshipStatus extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: AirshipInnerNetObjects;

  get aprilShipStatus(): InnerAirshipStatus {
    return this.innerNetObjects[0];
  }

  constructor(room: RoomImplementation) {
    super(SpawnType.Airship, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityAirshipStatus {
    const airshipStatus = new EntityAirshipStatus(room);

    airshipStatus.setSpawn(flags, owner, innerNetObjects);

    return airshipStatus;
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
      InnerAirshipStatus.spawn(innerNetObjects[0], this),
    ];
  }
}
