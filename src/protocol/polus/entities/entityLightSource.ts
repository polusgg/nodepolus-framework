import { BaseInnerNetEntity } from "../../entities/baseEntity";
import { Connection } from "../../connection";
import { InnerLightSource, InnerCustomNetworkTransformGeneric } from "../innerNetObjects";
import { EdgeAlignments, SpawnFlag } from "../../../types/enums";
import { GameDataPacket } from "../../../protocol/packets/root";
import { RpcPacket } from "../../../protocol/packets/gameData";
import { CNTSnapToPacket } from "../packets/rpc/customNetworkTransform";
import { Attachable, Vector2 } from "../../../types";

export class EntityLightSource extends BaseInnerNetEntity {
  constructor(
    owner: Connection,
    radius: number,
    position: Vector2 = Vector2.zero(),
    z: number = -50,
    attachedTo: number = -1,
    lightSourceNetId: number = owner.getLobby()!.getHostInstance().getNextNetId(),
    customNetworkTransformNetId: number = owner.getLobby()!.getHostInstance().getNextNetId(),
  ) {
    super(0x86, owner.getLobby()!, owner.getId(), SpawnFlag.None);

    this.innerNetObjects = [
      new InnerLightSource(this, lightSourceNetId, radius),
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

  getRadius(): number {
    return this.getLightSource().getRadius();
  }

  async setRadius(radius: number): Promise<void> {
    const data = this.getLightSource().setRadius(radius).serializeData();

    return this.getLobby().findSafeConnection(this.getOwnerId()).writeReliable(new GameDataPacket([
      data,
    ], this.getLobby().getCode()));
  }

  getLightSource(): InnerLightSource {
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

