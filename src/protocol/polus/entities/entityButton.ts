import { InnerCustomNetworkTransformGeneric } from "../innerNetObjects/innerCustomNetworkTransformGeneric";
import { BaseInnerNetEntity } from "../../entities/baseEntity";
import { InnerClickBehaviour, InnerGraphic } from "../innerNetObjects";
import { EdgeAlignments, SpawnFlag } from "../../../types/enums";
import { Connection } from "../../connection";
import { Attachable, Vector2 } from "../../../types";
import { GameDataPacket } from "../../packets/root";

export class EntityButton extends BaseInnerNetEntity {
  constructor(
    private readonly owner: Connection,
    resourceId: number,
    maxTimer: number,
    position: Vector2,
    alignment: EdgeAlignments = EdgeAlignments.None,
    currentTime: number = 0,
    saturated: boolean = true,
    color: [number, number, number, number] = [255, 255, 255, 255],
    isCountingDown: boolean = true,
    z: number = -50,
    attachedTo: number = -1,
    customNetworkTransformNetId: number = owner.getLobby()!.getHostInstance().getNextNetId(),
    graphicNetId: number = owner.getLobby()!.getHostInstance().getNextNetId(),
    clickBehaviourNetId: number = owner.getLobby()!.getHostInstance().getNextNetId(),
  ) {
    super(0x81, owner.getLobby()!, owner.getId(), SpawnFlag.None);

    this.innerNetObjects = [
      new InnerCustomNetworkTransformGeneric(this, alignment, position, z, attachedTo, customNetworkTransformNetId),
      new InnerGraphic(this, resourceId, graphicNetId),
      new InnerClickBehaviour(this, maxTimer, currentTime, saturated, color, isCountingDown, clickBehaviourNetId),
    ];
  }

  async attach(to: Attachable, sendTo: Connection[] = [this.owner]): Promise<void> {
    const data = this.getCustomNetworkTransform().setAttachedTo(to).serializeData();

    await Promise.allSettled(sendTo.map(async conn => conn.writeReliable(new GameDataPacket([
      data,
    ], this.getLobby().getCode()))));
  }

  getCustomNetworkTransform(): InnerCustomNetworkTransformGeneric {
    return this.getObject(0);
  }

  getGraphic(): InnerGraphic {
    return this.getObject(1);
  }

  getClickBehaviour(): InnerClickBehaviour {
    return this.getObject(2);
  }

  despawn(): void {
    for (let i = 0; i < this.innerNetObjects.length; i++) {
      this.lobby.despawn(this.innerNetObjects[i]);
    }
  }
}

