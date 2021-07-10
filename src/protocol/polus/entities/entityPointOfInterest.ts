import { BaseInnerNetEntity } from "../../entities/baseEntity";
import { Connection } from "../../connection";
import { InnerGraphic, InnerPointOfInterest, InnerCustomNetworkTransformGeneric } from "../innerNetObjects";
import { EdgeAlignments, SpawnFlag } from "../../../types/enums";
import { Attachable, Vector2 } from "../../../types";
import { GameDataPacket } from "../../packets/root";
import { RpcPacket } from "../../packets/gameData";
import { CNTSnapToPacket } from "../packets/rpc/customNetworkTransform";

export class EntityPointOfInterest extends BaseInnerNetEntity {
  constructor(
    owner: Connection,
    resourceId: number,
    position: Vector2 = Vector2.zero(),
    z: number = -50,
    attachedTo: number = -1,
    pointOfInterestNetId: number = owner.getLobby()!.getHostInstance().getNextNetId(),
    graphicNetId: number = owner.getLobby()!.getHostInstance().getNextNetId(),
    customNetworkTransformNetId: number = owner.getLobby()!.getHostInstance().getNextNetId(),
  ) {
    super(0x87, owner.getLobby()!, owner.getId(), SpawnFlag.None);

    this.innerNetObjects = [
      new InnerPointOfInterest(this, pointOfInterestNetId),
      new InnerGraphic(this, resourceId, graphicNetId),
      new InnerCustomNetworkTransformGeneric(this, EdgeAlignments.None, position, z, attachedTo, customNetworkTransformNetId),
    ];
  }

  getPosition(): Vector2 {
    return this.getCustomNetworkTransform().getPosition();
  }

  async setPosition(position: Vector2): Promise<void> {
    const data = this.getCustomNetworkTransform().setPosition(position).serializeData();

    return this.getLobby().findSafeConnection(this.getOwnerId()).writeReliable(new GameDataPacket([
      data,
    ], this.getLobby().getCode()));
  }

  async snapPosition(position: Vector2): Promise<void> {
    this.getCustomNetworkTransform().setPosition(position);

    return this.getLobby().findSafeConnection(this.getOwnerId()).writeReliable(new GameDataPacket([
      new RpcPacket(
        this.getCustomNetworkTransform().getNetId(),
        new CNTSnapToPacket(position),
      ),
    ], this.getLobby().getCode()));
  }

  async attach(to: Attachable): Promise<void> {
    const data = this.getCustomNetworkTransform().setAttachedTo(to).serializeData();

    return this.getLobby().findSafeConnection(this.getOwnerId()).writeReliable(new GameDataPacket([
      data,
    ], this.getLobby().getCode()));
  }

  getPointOfInterest(): InnerPointOfInterest {
    return this.getObject(0);
  }

  getGraphic(): InnerGraphic {
    return this.getObject(1);
  }

  getCustomNetworkTransform(): InnerCustomNetworkTransformGeneric {
    return this.getObject(2);
  }

  despawn(): void {
    for (let i = 0; i < this.innerNetObjects.length; i++) {
      this.lobby.despawn(this.innerNetObjects[i]);
    }
  }
}

