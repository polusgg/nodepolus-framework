import { SpawnPacket, SpawnInnerNetObject } from "../../packets/rootGamePackets/gameDataPackets/spawn";
import { CustomNetworkTransform } from "./customNetworkTransform";
import { SpawnFlag } from "../../../types/spawnFlag";
import { SpawnType } from "../../../types/spawnType";
import { PlayerPhysics } from "./playerPhysics";
import { PlayerControl } from "./playerControl";
import { BaseEntity } from "../baseEntity";

export type PlayerInnerNetObjects = [ PlayerControl, PlayerPhysics, CustomNetworkTransform ];

export class EntityPlayer extends BaseEntity {
  public innerNetObjects: PlayerInnerNetObjects;

  get playerControl(): PlayerControl {
    return this.innerNetObjects[0];
  }
  
  get playerPhysics(): PlayerPhysics {
    return this.innerNetObjects[1];
  }
  
  get customNetworkTransform(): CustomNetworkTransform {
    return this.innerNetObjects[2];
  }

  private constructor(
    public owner: number,
    public flags: SpawnFlag,
    innerNetObjectsRaw: SpawnInnerNetObject[],
  ) {
    super(SpawnType.PlayerControl);

    this.innerNetObjects = [
      PlayerControl.spawn(innerNetObjectsRaw[0]),
      PlayerPhysics.spawn(innerNetObjectsRaw[1]),
      CustomNetworkTransform.spawn(innerNetObjectsRaw[2]),
    ];
  }

  static spawn(packet: SpawnPacket): EntityPlayer {
    if (packet.type != SpawnType.PlayerControl) {
      throw new Error(`PlayerControl spawned with a ${packet.type} packet instead of a PlayerControl packet (4)`);
    }
    
    return new EntityPlayer(packet.owner, packet.flags, packet.innerNetObjects);
  }

  setSpawn(packet: SpawnPacket) {
    this.owner = packet.owner;
    this.flags = packet.flags;
    this.innerNetObjects = [
      PlayerControl.spawn(packet.innerNetObjects[0]),
      PlayerPhysics.spawn(packet.innerNetObjects[1]),
      CustomNetworkTransform.spawn(packet.innerNetObjects[2]),
    ];
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
}
