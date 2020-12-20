import { SpawnInnerNetObject, SpawnPacket } from "../../packets/gameData/spawn";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { InnerAirshipStatus } from "./innerAirshipStatus";
import { LobbyImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

export type AirshipStatusInnerNetObjects = [ InnerAirshipStatus ];

export class EntityAirshipStatus extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: AirshipStatusInnerNetObjects;

  get aprilShipStatus(): InnerAirshipStatus {
    return this.innerNetObjects[0];
  }

  constructor(lobby: LobbyImplementation) {
    super(SpawnType.Airship, lobby);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], lobby: LobbyImplementation): EntityAirshipStatus {
    const airshipStatus = new EntityAirshipStatus(lobby);

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
