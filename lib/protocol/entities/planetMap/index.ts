import { SpawnPacket, SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { InnerPlanetMap } from "./innerPlanetMap";
import { BaseEntity } from "../baseEntity";
import { RoomImplementation } from "../types";

export type PlanetMapInnerNetObjects = [ InnerPlanetMap ];

export class EntityPlanetMap extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: PlanetMapInnerNetObjects;
  
  get planetMap(): InnerPlanetMap {
    return this.innerNetObjects[0];
  }

  private constructor(room: RoomImplementation) {
    super(SpawnType.PlanetMap, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityPlanetMap {
    let planetMap = new EntityPlanetMap(room);

    planetMap.setSpawn(flags, owner, innerNetObjects);

    return planetMap;
  }

  setSpawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]) {
    this.owner = owner;
    this.innerNetObjects = [
      InnerPlanetMap.spawn(innerNetObjects[0], this),
    ];
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
}
