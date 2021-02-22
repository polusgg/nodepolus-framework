import { InnerCustomNetworkTransform, InnerPlayerControl, InnerPlayerPhysics } from ".";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { BaseInnerNetEntity } from "../baseEntity";
import { LobbyInstance } from "../../../api/lobby";
import { InternalLobby } from "../../../lobby";
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
    position: Vector2 = Vector2.zero(),
    velocity: Vector2 = Vector2.zero(),
    playerId: number = lobby.getHostInstance().getNextPlayerId(),
    isNew: boolean = false,
    flags: SpawnFlag = SpawnFlag.IsClientCharacter,
    sequenceId: number = 5,
    playerControlNetId: number = lobby.getHostInstance().getNextNetId(),
    playerPhysicsNetId: number = lobby.getHostInstance().getNextNetId(),
    customNetworkTransformNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(SpawnType.PlayerControl, lobby, owner, flags);

    this.innerNetObjects = [
      new InnerPlayerControl(this, playerId, isNew, playerControlNetId),
      new InnerPlayerPhysics(this, playerPhysicsNetId),
      new InnerCustomNetworkTransform(this, position, velocity, sequenceId, customNetworkTransformNetId),
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
