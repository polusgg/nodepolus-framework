import { InnerCustomNetworkTransform, InnerPlayerControl, InnerPlayerPhysics } from ".";
import { SpawnInnerNetObject } from "../../packets/gameData/types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { BaseEntity, LobbyImplementation } from "../types";
import { SpawnPacket } from "../../packets/gameData";

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

  constructor(lobby: LobbyImplementation) {
    super(SpawnType.PlayerControl, lobby);
  }

  static spawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[], lobby: LobbyImplementation): EntityPlayer {
    const player = new EntityPlayer(lobby);

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

  setSpawn(flags: SpawnFlag, owner: number, innerNetObjects: SpawnInnerNetObject[]): void {
    this.owner = owner;
    this.flags = flags;
    this.innerNetObjects = [
      InnerPlayerControl.spawn(innerNetObjects[0], this),
      InnerPlayerPhysics.spawn(innerNetObjects[1], this),
      InnerCustomNetworkTransform.spawn(innerNetObjects[2], this),
    ];
  }
}
