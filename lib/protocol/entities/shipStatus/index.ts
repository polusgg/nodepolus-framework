import { SpawnPacket, SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { InnerShipStatus } from "./innerShipStatus";
import { BaseEntity } from "../baseEntity";
import { RoomImplementation } from "../types";

export type ShipStatusInnerNetObjects = [ InnerShipStatus ];

export class EntityShipStatus extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.None;
  public innerNetObjects!: ShipStatusInnerNetObjects;

  get shipStatus(): InnerShipStatus {
    return this.innerNetObjects[0];
  }

  private constructor(room: RoomImplementation) {
    super(SpawnType.ShipStatus, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityShipStatus {
    let shipStatus = new EntityShipStatus(room);

    shipStatus.setSpawn(flags, owner, innerNetObjects);

    return shipStatus;
  }

  setSpawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]) {
    this.owner = owner;
    this.innerNetObjects = [
      InnerShipStatus.spawn(innerNetObjects[0], this),
    ];
  }

  getSpawn(): SpawnPacket {
    return new SpawnPacket(
      this.type,
      this.owner,
      this.flags,
      [
        this.shipStatus.spawn(),
      ],
    );
  }
}
