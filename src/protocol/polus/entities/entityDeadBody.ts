import { BaseInnerNetEntity } from "../../entities/baseEntity";
import { GLOBAL_OWNER } from "../../../util/constants";
import { LobbyInstance } from "../../../api/lobby";
import { BodyDirection, SpawnFlag, EdgeAlignments } from "../../../types/enums";
import { InnerDeadBody, InnerCustomNetworkTransformGeneric } from "../innerNetObjects";
import { Vector2 } from "../../../types";

export class EntityDeadBody extends BaseInnerNetEntity {
  constructor(
    lobby: LobbyInstance,
    color: [number, number, number, number],
    shadowColor: [number, number, number, number],
    position: Vector2,
    hasFallen: boolean = false,
    bodyFacing: BodyDirection = BodyDirection.FacingLeft,
    alignment: EdgeAlignments = EdgeAlignments.None,
    z: number = -50,
    attachedTo: number = -1,
    deadBodyNetId: number = lobby.getHostInstance().getNextNetId(),
    customNetworkTransformNetId: number = lobby.getHostInstance().getNextNetId(),
  ) {
    super(0x83, lobby, GLOBAL_OWNER, SpawnFlag.None);

    this.innerNetObjects = [
      new InnerDeadBody(this, color, shadowColor, hasFallen, bodyFacing, deadBodyNetId),
      new InnerCustomNetworkTransformGeneric(this, alignment, position, z, attachedTo, customNetworkTransformNetId),
    ];
  }

  getDeadBody(): InnerDeadBody {
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
