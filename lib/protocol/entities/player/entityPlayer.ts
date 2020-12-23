import { InnerCustomNetworkTransform, InnerPlayerControl, InnerPlayerPhysics } from ".";
import { BaseInnerNetEntity, LobbyImplementation } from "../types";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { SpawnPacket } from "../../packets/gameData";
import { Vector2 } from "../../../types";

export class EntityPlayer extends BaseInnerNetEntity {
  public innerNetObjects: [ InnerPlayerControl, InnerPlayerPhysics, InnerCustomNetworkTransform ];

  get playerControl(): InnerPlayerControl {
    return this.innerNetObjects[0];
  }

  get playerPhysics(): InnerPlayerPhysics {
    return this.innerNetObjects[1];
  }

  get customNetworkTransform(): InnerCustomNetworkTransform {
    return this.innerNetObjects[2];
  }

  constructor(
    lobby: LobbyImplementation,
    owner: number,
    playerControlNetId: number,
    playerId: number,
    playerPhysicsNetId: number,
    customNetworkTransformNetId: number,
    sequenceId: number,
    position: Vector2,
    velocity: Vector2,
  ) {
    super(SpawnType.PlayerControl, lobby, owner, SpawnFlag.IsClientCharacter);

    this.innerNetObjects = [
      new InnerPlayerControl(playerControlNetId, this, true, playerId),
      new InnerPlayerPhysics(playerPhysicsNetId, this),
      new InnerCustomNetworkTransform(customNetworkTransformNetId, this, sequenceId, position, velocity),
    ];
  }

  serializeSpawn(): SpawnPacket {
    return new SpawnPacket(
      SpawnType.PlayerControl,
      this.owner,
      this.flags,
      [
        this.playerControl.serializeSpawn(),
        this.playerPhysics.serializeSpawn(),
        this.customNetworkTransform.serializeSpawn(),
      ],
    );
  }
}
