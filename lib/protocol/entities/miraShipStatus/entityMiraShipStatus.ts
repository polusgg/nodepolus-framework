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

  static spawn(owner: number, flags: SpawnFlag, innerNetObjects: SpawnInnerNetObject[], lobby: LobbyImplementation): EntityMiraShipStatus {
    const miraShipStatus = new EntityMiraShipStatus(lobby);

    miraShipStatus.setSpawn(owner, flags, innerNetObjects);

    return miraShipStatus;
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

  setSpawn(owner: number, _flags: SpawnFlag, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.innerNetObjects = [
      InnerMiraShipStatus.spawn(innerNetObjects[0], this),
    ];
  }
}
