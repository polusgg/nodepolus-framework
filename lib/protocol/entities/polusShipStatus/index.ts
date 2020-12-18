import { SpawnInnerNetObject, SpawnPacket } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { InnerPolusShipStatus } from "./innerPolusShipStatus";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { RoomImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

export type PolusShipStatusInnerNetObjects = [ InnerPolusShipStatus ];

export class EntityPolusShipStatus extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: PolusShipStatusInnerNetObjects;

  get planetMap(): InnerPolusShipStatus {
    return this.innerNetObjects[0];
  }

  constructor(room: RoomImplementation) {
    super(SpawnType.PlanetMap, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityPolusShipStatus {
    const planetMap = new EntityPolusShipStatus(room);

    planetMap.setSpawn(flags, owner, innerNetObjects);

    return planetMap;
  }

  getSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.PlanetMap,
      this.owner,
      this.flags,
      [
        this.planetMap.spawn(),
      ],
    );
  }

  setSpawn(_flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.innerNetObjects = [
      InnerPolusShipStatus.spawn(innerNetObjects[0], this),
    ];
  }
}
