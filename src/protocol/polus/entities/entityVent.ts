import { LobbyInstance } from "../../../api/lobby";
import { BaseInnerNetEntity } from "../../entities/baseEntity";
import { Vector2 } from "../../../types";
import { GLOBAL_OWNER } from "../../../util/constants";
import { InnerCustomNetworkTransformGeneric, InnerVent } from "../innerNetObjects";
import { EdgeAlignments, SpawnFlag } from "../../../types/enums";

export class EntityVent extends BaseInnerNetEntity {
  constructor(
    lobby: LobbyInstance,
    ventId: number,
    leftConnection: number,
    rightConnection: number,
    centerConnection: number,
    ventSpriteResourceId: number,
    enterVentAnimationResourceId: number,
    exitVentAnimationResourceId: number,
    position: Vector2 = Vector2.zero(),
    z: number = -50,
    attachedTo: number = -1,
    ventNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(0x84, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerVent(this, ventNetId, ventSpriteResourceId, enterVentAnimationResourceId, exitVentAnimationResourceId, ventId, leftConnection, rightConnection, centerConnection),
      new InnerCustomNetworkTransformGeneric(this, EdgeAlignments.None, position, z, attachedTo),
    ];
  }

  getVent(): InnerVent {
    return this.getObject(0);
  }

  getCustomNetworkTransform(): InnerCustomNetworkTransformGeneric {
    return this.getObject(1);
  }

  despawn(): void {
    for (let i = 0; i < this.innerNetObjects.length; i++) {
      this.lobby.despawn(this.innerNetObjects[i]);
    }
  }
}
