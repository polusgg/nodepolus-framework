import { SpawnInnerNetObject, SpawnPacket } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { InnerHeadquarters } from "./innerHeadquarters";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { RoomImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

export type HeadquartersInnerNetObjects = [ InnerHeadquarters ];

export class EntityHeadquarters extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: HeadquartersInnerNetObjects;

  get headquarters(): InnerHeadquarters {
    return this.innerNetObjects[0];
  }

  constructor(room: RoomImplementation) {
    super(SpawnType.Headquarters, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityHeadquarters {
    const headquarters = new EntityHeadquarters(room);

    headquarters.setSpawn(flags, owner, innerNetObjects);

    return headquarters;
  }

  getSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.Headquarters,
      this.owner,
      this.flags,
      [
        this.headquarters.spawn(),
      ],
    );
  }

  setSpawn(_flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.innerNetObjects = [
      InnerHeadquarters.spawn(innerNetObjects[0], this),
    ];
  }
}
