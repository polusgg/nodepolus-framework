import { Connection } from "../../connection";
import { BaseInnerNetEntity, BaseInnerNetObject } from "../../entities/baseEntity";
import { DataPacket, SpawnPacketObject } from "../../packets/gameData";
import { BaseRpcPacket } from "../../packets/rpc";
import { Vector2 } from "../../../types";
import { RpcPacketType } from "../../../types/enums";
import { MessageWriter } from "../../../util/hazelMessage";
import { EntityCameraController } from "../entities";
import { BeginCameraAnimation } from "../packets/rpc/cameraController/beginAnimation";
import { CameraAnimationKeyframe } from "../animation/camera";

export class InnerCameraController extends BaseInnerNetObject {
  constructor(parent: BaseInnerNetEntity, netId: number, protected offset: Vector2 = Vector2.zero()) {
    super(0x84, parent, netId);
  }

  getOffset(): Vector2 {
    return this.offset;
  }

  setOffset(offset: Vector2): this {
    this.offset = offset;

    return this;
  }

  getParent(): EntityCameraController {
    return this.parent as EntityCameraController;
  }

  clone(): InnerCameraController {
    return new InnerCameraController(this.parent, this.netId, this.offset);
  }

  serializeData(): DataPacket {
    return new DataPacket(this.netId, new MessageWriter().writeVector2(this.offset));
  }

  serializeSpawn(): SpawnPacketObject {
    return new SpawnPacketObject(this.netId, new MessageWriter().writeVector2(this.offset));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async handleRpc(_connection: Connection, _type: RpcPacketType, _packet: BaseRpcPacket, _sendTo?: Connection[]): Promise<void> { }

  async beginAnimation(connection: Connection, keyframes: CameraAnimationKeyframe[], reset: boolean): Promise<void> {
    await this.sendRpcPacket(new BeginCameraAnimation(keyframes, reset), [connection]);
  }
}
