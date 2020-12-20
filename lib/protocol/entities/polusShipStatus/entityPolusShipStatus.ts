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

  static spawn(owner: number, flags: SpawnFlag, innerNetObjects: SpawnInnerNetObject[], lobby: LobbyImplementation): EntityPolusShipStatus {
    const polusShipStatus = new EntityPolusShipStatus(lobby);

    polusShipStatus.setSpawn(owner, flags, innerNetObjects);

    return polusShipStatus;
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

  setSpawn(owner: number, _flags: SpawnFlag, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.innerNetObjects = [
      InnerPolusShipStatus.spawn(innerNetObjects[0], this),
    ];
  }
}
