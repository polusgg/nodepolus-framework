import { InnerCustomNetworkTransform, InnerPlayerControl, InnerPlayerPhysics } from ".";
import { SpawnFlag, SpawnType } from "../../../types/enums";
import { BaseInnerNetEntity } from "../baseEntity";
import { LobbyInstance } from "../../../api/lobby";
import { Vector2 } from "../../../types";
import { Lobby } from "../../../lobby";

export class EntityPlayer extends BaseInnerNetEntity {
  constructor(
    lobby: LobbyInstance,
    ownerId: number,
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
    super(SpawnType.PlayerControl, lobby, ownerId, flags);

    this.innerNetObjects = [
      new InnerPlayerControl(this, playerId, isNew, playerControlNetId),
      new InnerPlayerPhysics(this, playerPhysicsNetId),
      new InnerCustomNetworkTransform(this, position, velocity, sequenceId, customNetworkTransformNetId),
    ];
  }

  getPlayerControl(): InnerPlayerControl {
    return this.getObject(0);
  }

  getPlayerPhysics(): InnerPlayerPhysics {
    return this.getObject(1);
  }

  getCustomNetworkTransform(): InnerCustomNetworkTransform {
    return this.getObject(2);
  }

  despawn(): void {
    for (let i = 0; i < this.innerNetObjects.length; i++) {
      this.lobby.despawn(this.innerNetObjects[i]);
    }

    const player = (this.lobby as Lobby).findPlayerByEntity(this);

    if (player) {
      this.lobby.removePlayer(player);
    }
  }
}
