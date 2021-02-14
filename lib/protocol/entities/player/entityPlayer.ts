import { InnerCustomNetworkTransform, InnerPlayerControl, InnerPlayerPhysics } from ".";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { LobbyInstance } from "../../../api/lobby";
import { InternalLobby } from "../../../lobby";
import { BaseInnerNetEntity } from "../types";
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
    lobby: LobbyInstance,
    owner: number,
    playerControlNetId: number,
    playerId: number,
    playerPhysicsNetId: number,
    customNetworkTransformNetId: number,
    sequenceId: number,
    position: Vector2,
    velocity: Vector2,
    flags: SpawnFlag = SpawnFlag.IsClientCharacter,
  ) {
    super(SpawnType.PlayerControl, lobby, owner, flags);

    this.innerNetObjects = [
      new InnerPlayerControl(playerControlNetId, this, true, playerId),
      new InnerPlayerPhysics(playerPhysicsNetId, this),
      new InnerCustomNetworkTransform(customNetworkTransformNetId, this, sequenceId, position, velocity),
    ];
  }

  despawn(): void {
    for (let i = 0; i < this.innerNetObjects.length; i++) {
      this.lobby.despawn(this.innerNetObjects[i]);
    }

    const player = (this.lobby as InternalLobby).findPlayerByEntity(this);

    if (player) {
      this.lobby.removePlayer(player);
    }
  }
}
