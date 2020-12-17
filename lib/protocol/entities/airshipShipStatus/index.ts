import { SpawnInnerNetObject, SpawnPacket } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { InnerAirship } from "./innerArshipShipStatus";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { RoomImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

export type AirshipInnerNetObjects = [ InnerAirship ];

export class EntityAirship extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: AirshipInnerNetObjects;

  get aprilShipStatus(): InnerAirship {
    return this.innerNetObjects[0];
  }

  constructor(room: RoomImplementation) {
    super(SpawnType.AprilShipStatus, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityAirship {
    const aprilShipStatus = new EntityAirship(room);

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
      InnerAirship.spawn(innerNetObjects[0], this),
    ];
  }
}
