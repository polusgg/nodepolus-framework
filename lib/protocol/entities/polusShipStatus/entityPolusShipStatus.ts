import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { BaseEntity, LobbyImplementation } from "../types";
import { SpawnPacket } from "../../packets/gameData";
import { InnerPolusShipStatus } from ".";

export type PolusShipStatusInnerNetObjects = [ InnerPolusShipStatus ];

export class EntityPolusShipStatus extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: PolusShipStatusInnerNetObjects;

  get planetMap(): InnerPolusShipStatus {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation) {
    super(SpawnType.PlanetMap, lobby);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], lobby: LobbyImplementation): EntityPolusShipStatus {
    const planetMap = new EntityPolusShipStatus(lobby);

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
