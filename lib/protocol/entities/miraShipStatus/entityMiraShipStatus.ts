import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { BaseEntity, LobbyImplementation } from "../types";
import { SpawnPacket } from "../../packets/gameData";
import { InnerMiraShipStatus } from ".";

export type MiraShipStatusInnerNetObjects = [ InnerMiraShipStatus ];

export class EntityMiraShipStatus extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: MiraShipStatusInnerNetObjects;

  get headquarters(): InnerMiraShipStatus {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation) {
    super(SpawnType.Headquarters, lobby);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], lobby: LobbyImplementation): EntityMiraShipStatus {
    const headquarters = new EntityMiraShipStatus(lobby);

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
      InnerMiraShipStatus.spawn(innerNetObjects[0], this),
    ];
  }
}
