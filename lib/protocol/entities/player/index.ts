import { SpawnInnerNetObject, SpawnPacket } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { InnerCustomNetworkTransform } from "./innerCustomNetworkTransform";
import { InnerPlayerControl } from "./innerPlayerControl";
import { InnerPlayerPhysics } from "./innerPlayerPhysics";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { RoomImplementation } from "../types";
import { BaseEntity } from "../baseEntity";

export type PlayerInnerNetObjects = [ InnerPlayerControl, InnerPlayerPhysics, InnerCustomNetworkTransform ];

export class EntityPlayer extends BaseEntity {
  public owner!: number;
  public flags: SpawnFlag = SpawnFlag.IsClientCharacter;
  public innerNetObjects!: PlayerInnerNetObjects;

  get playerControl(): InnerPlayerControl {
    return this.innerNetObjects[0];
  }

  get playerPhysics(): InnerPlayerPhysics {
    return this.innerNetObjects[1];
  }

  get customNetworkTransform(): InnerCustomNetworkTransform {
    return this.innerNetObjects[2];
  }

  private constructor(room: RoomImplementation) {
    super(SpawnType.PlayerControl, room);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], room: RoomImplementation): EntityPlayer {
    const player = new EntityPlayer(room);

    player.setSpawn(flags, owner, innerNetObjects);

    return player;
  }

  getSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.PlayerControl,
      this.owner,
      this.flags,
      [
        this.playerControl.spawn(),
        this.playerPhysics.spawn(),
        this.customNetworkTransform.spawn(),
      ],
    );
  }

  setSpawn(_flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.innerNetObjects = [
      InnerPlayerControl.spawn(innerNetObjects[0], this),
      InnerPlayerPhysics.spawn(innerNetObjects[1], this),
      InnerCustomNetworkTransform.spawn(innerNetObjects[2], this),
    ];
  }
}
